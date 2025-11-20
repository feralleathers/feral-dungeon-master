const REMOTE_PROFILE_ROOT = 'https://dungeon.feralleathers.com/api/profiles';
const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1)$/i;
const PROFILE_API_ROOT = LOCAL_HOST_PATTERN.test(window.location.hostname)
  ? REMOTE_PROFILE_ROOT
  : '/api/profiles';

class ProfileSyncError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'ProfileSyncError';
    this.response = response;
  }
}

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function handleResponse(response) {
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const message = payload?.message || response.statusText || 'Unable to reach profile API.';
    throw new ProfileSyncError(message, response);
  }
  return payload;
}

function buildEndpoint(profileId) {
  return `${PROFILE_API_ROOT}/${encodeURIComponent(profileId)}`;
}

export async function listProfiles({ cursor } = {}) {
  const url = new URL(PROFILE_API_ROOT, window.location.origin);
  url.searchParams.set('limit', '50');
  if (cursor) url.searchParams.set('cursor', cursor);
  const response = await fetch(url.toString(), { method: 'GET' });
  return handleResponse(response);
}

export async function fetchProfile(profileId) {
  const response = await fetch(buildEndpoint(profileId), { method: 'GET' });
  if (response.status === 404) return null;
  return handleResponse(response);
}

export async function upsertProfile(profileId, payload, { method = 'PUT' } = {}) {
  const response = await fetch(buildEndpoint(profileId), {
    method,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

export { ProfileSyncError };
