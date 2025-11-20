const API_PREFIX = '/api/profiles';
const KEY_PREFIX = 'fdm:profile:';
const ID_REGEX = /^[a-zA-Z0-9\-_:.]{1,128}$/;

const CORS_HEADERS = {
  'content-type': 'application/json;charset=UTF-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,OPTIONS',
  'access-control-allow-headers': 'Content-Type'
};

function buildKey(id) {
  return `${KEY_PREFIX}${id}`;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS
  });
}

function emptyCorsResponse(status = 204) {
  return new Response(null, {
    status,
    headers: CORS_HEADERS
  });
}

function validateId(id) {
  return typeof id === 'string' && ID_REGEX.test(id);
}

async function parsePayload(request) {
  const text = await request.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return { error: 'invalid-json', message: 'Request body is not valid JSON.' };
  }
}

async function listProfiles(env) {
  if (!env.PROFILE_STORE) {
    return jsonResponse({ error: 'missing-kv', message: 'KV binding PROFILE_STORE not found.' }, 500);
  }
  const list = await env.PROFILE_STORE.list({ prefix: KEY_PREFIX, limit: 50 });
  const payload = list.keys.map((entry) => ({
    profileId: entry.name.replace(KEY_PREFIX, ''),
    metadata: entry.metadata || {}
  }));
  return jsonResponse({ profiles: payload, cursor: list.cursor, complete: list.list_complete });
}

async function fetchProfile(id, env) {
  if (!env.PROFILE_STORE) {
    return jsonResponse({ error: 'missing-kv', message: 'KV binding PROFILE_STORE not found.' }, 500);
  }
  const stored = await env.PROFILE_STORE.get(buildKey(id), { type: 'json' });
  if (!stored) {
    return jsonResponse({ error: 'not-found', message: 'Profile not found.' }, 404);
  }
  return jsonResponse(stored);
}

async function upsertProfile(id, request, env) {
  if (!env.PROFILE_STORE) {
    return jsonResponse({ error: 'missing-kv', message: 'KV binding PROFILE_STORE not found.' }, 500);
  }
  const payload = await parsePayload(request);
  if (payload?.error === 'invalid-json') {
    return jsonResponse(payload, 400);
  }
  const key = buildKey(id);
  const existing = await env.PROFILE_STORE.get(key, { type: 'json' });
  const mergedQuestionnaire = payload?.questionnaire || existing?.questionnaire || null;
  const next = {
    ...existing,
    ...payload,
    questionnaire: mergedQuestionnaire,
    profileId: id,
    version: Math.max(existing?.version || 0, payload?.version || 0) + 1,
    metadata: {
      ...(existing?.metadata || {}),
      ...payload?.metadata,
      syncedAt: new Date().toISOString()
    }
  };
  await env.PROFILE_STORE.put(key, JSON.stringify(next), {
    metadata: {
      profileName: next.publicProfile?.profileName || next.profileName || '',
      version: next.version
    }
  });
  return jsonResponse(next);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    if (!segments.length || segments[0] !== 'api' || segments[1] !== 'profiles') {
      return jsonResponse({ error: 'not-found', message: 'Route not registered.' }, 404);
    }
    if (request.method === 'OPTIONS') {
      return emptyCorsResponse();
    }
    const profileId = segments[2];
    const method = request.method.toUpperCase();
    if (!profileId) {
      if (method === 'GET') {
        return listProfiles(env);
      }
      return jsonResponse({ error: 'missing-id', message: 'Profile id is required.' }, 400);
    }
    if (!validateId(profileId)) {
      return jsonResponse({ error: 'invalid-id', message: 'Profile id contains invalid characters.' }, 400);
    }
    if (method === 'GET') {
      return fetchProfile(profileId, env);
    }
    if (method === 'PUT' || method === 'POST') {
      return upsertProfile(profileId, request, env);
    }
    return jsonResponse({ error: 'method-not-allowed', message: 'Use GET, POST, or PUT for this endpoint.' }, 405);
  }
};
