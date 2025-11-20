import { buildQuestionnaireDefaults } from './question-bank.js';

const PROFILE_BUNDLE_KEY = 'fdm.profile.bundle.v2';
const ACTIVE_PROFILE_KEY = 'fdm.profile.activeId';
const LEGACY_ITEM_KEY = 'fdm.inventory.items.v2';
const LEGACY_NAME_KEY = 'fdm.inventory.profileName';

const eventMap = new Map();
let bundle = { profiles: {}, activeId: null };
let initialised = false;
let initialising = false;

const defaultProfile = () => ({
  version: 2,
  profileId: makeId('profile'),
  profileName: '',
  persona: {
    role: 'switch',
    honorific: '',
    nounAura: 'neutral',
    tone: 'dominant',
    sceneNames: [],
    disposition: 'Balanced'
  },
  publicProfile: {
    summary: '',
    bio: '',
    subtitle: '',
    pronouns: 'they/them',
    intent: '',
    tags: []
  },
  privateProfile: {
    negotiationNotes: '',
    aftercarePlan: '',
    riskNotes: ''
  },
  limits: { hard: [], soft: [], notes: '' },
  preferences: { gear: [], fetishes: [], personaCues: [] },
  safety: {
    breath: { intensity: 'Medium', experience: 'New' },
    tickling: 'Moderate',
    masochism: 'Moderate',
    medical: [],
    safewords: { primary: 'Red', secondary: 'Yellow', muffled: '', nonverbal: [] }
  },
  inventory: { items: [], metaVersion: 'fdm.inventory.meta.v1' },
  sceneTemplates: [],
  hypnosisPresets: [],
  analytics: { gearFrequency: {}, zoneUsage: {}, lastUpdated: null },
  profilePhotos: {
    main: '',
    additional: ['', '', '', '']
  },
  security: { encrypted: false, encryption: null, integrity: null },
  questionnaire: buildQuestionnaireDefaults()
});

function init() {
  if (initialised) return bundle.activeId;
  if (initialising) return bundle.activeId;
  initialising = true;
  try {
    bundle = loadBundle();
    const hasActive = bundle.activeId && bundle.profiles[bundle.activeId];
    if (!hasActive) {
      const legacyItems = loadLegacyItems();
      const legacyName = safeStorage('get', LEGACY_NAME_KEY) || '';
      const profile = mergeProfile(defaultProfile(), {
        inventory: { items: legacyItems },
        profileName: legacyName
      });
      bundle.profiles[profile.profileId] = profile;
      bundle.activeId = profile.profileId;
    }
    initialised = true;
    persistBundle();
    emit('profile:init', { profileId: bundle.activeId });
    return bundle.activeId;
  } finally {
    initialising = false;
  }
}

function loadBundle() {
  const cached = safeReadJSON(PROFILE_BUNDLE_KEY);
  if (cached && typeof cached === 'object') {
    const profiles = {};
    Object.values(cached.profiles || {}).forEach((profile) => {
      const normalised = normaliseProfile(profile);
      profiles[normalised.profileId] = normalised;
    });
    return { profiles, activeId: cached.activeId || null };
  }
  return { profiles: {}, activeId: null };
}

function getActiveProfile() {
  ensureInitialised();
  const profile = bundle.profiles[bundle.activeId];
  return profile ? clone(profile) : null;
}

function setActiveProfile(profileId) {
  ensureInitialised();
  if (!bundle.profiles[profileId]) return null;
  bundle.activeId = profileId;
  persistBundle();
  emit('profile:switched', { profileId });
  return getActiveProfile();
}

function getProfileName() {
  return getActiveProfile()?.profileName || '';
}

function setProfileName(name) {
  return mutateActiveProfile((draft) => {
    draft.profileName = (name || '').trim();
  }, { fields: ['profileName'] });
}

function setPublicProfile(patch) {
  return mutateActiveProfile((draft) => {
    const base = draft.publicProfile || defaultProfile().publicProfile;
    draft.publicProfile = mergePublicProfile(base, patch);
  }, { fields: ['publicProfile'] });
}

function setPrivateProfile(patch) {
  return mutateActiveProfile((draft) => {
    const base = draft.privateProfile || defaultProfile().privateProfile;
    draft.privateProfile = mergePrivateProfile(base, patch);
  }, { fields: ['privateProfile'] });
}

function getInventoryItems() {
  const profile = getActiveProfile();
  if (!profile) return [];
  return clone(Array.isArray(profile.inventory?.items) ? profile.inventory.items : []);
}

function replaceInventoryItems(items = [], metaVersion) {
  return mutateActiveProfile((draft) => {
    draft.inventory = draft.inventory || {};
    draft.inventory.items = clone(Array.isArray(items) ? items : []);
    if (metaVersion) draft.inventory.metaVersion = metaVersion;
    draft.analytics = draft.analytics || {};
    draft.analytics.lastUpdated = new Date().toISOString();
  }, { fields: ['inventory'] });
}

function exportActiveProfile() {
  const profile = getActiveProfile();
  return profile ? clone(profile) : null;
}

function importProfile(payload, { activate = true } = {}) {
  const incoming = normaliseProfile(payload);
  bundle.profiles[incoming.profileId] = incoming;
  if (activate) bundle.activeId = incoming.profileId;
  persistBundle();
  emit('profile:imported', { profileId: incoming.profileId, activate });
  return clone(incoming);
}

function update(mutator, opts = {}) {
  return mutateActiveProfile(mutator, opts);
}

function on(event, callback) {
  if (!eventMap.has(event)) eventMap.set(event, new Set());
  eventMap.get(event).add(callback);
  return () => eventMap.get(event)?.delete(callback);
}

function mutateActiveProfile(mutator, meta = {}) {
  ensureInitialised();
  const current = bundle.profiles[bundle.activeId];
  if (!current) return null;
  const draft = clone(current);
  mutator?.(draft);
  const next = normaliseProfile(draft, current.profileId);
  bundle.profiles[next.profileId] = next;
  bundle.activeId = next.profileId;
  persistBundle();
  emit('profile:updated', { profileId: next.profileId, fields: meta.fields || [] });
  return clone(next);
}

function normaliseProfile(payload, fallbackId) {
  const base = defaultProfile();
  const source = payload && typeof payload === 'object' ? payload : {};
  const normalizedSource = {
    ...source,
    publicProfile: source.publicProfile || source.public || {},
    privateProfile: source.privateProfile || source.private || {},
    questionnaire: source.questionnaire || {}
  };
  const profile = mergeProfile(base, normalizedSource);
  profile.version = 2;
  profile.profileId = source.profileId || source.id || fallbackId || base.profileId;
  profile.profileName = (source.profileName || source.name || '').toString();
  profile.inventory = profile.inventory || {};
  if (!Array.isArray(profile.inventory.items) && Array.isArray(source.items)) {
    profile.inventory.items = source.items;
  }
  if (!Array.isArray(profile.inventory.items)) profile.inventory.items = [];
  return profile;
}

function mergeProfile(base, patch) {
  if (!patch || typeof patch !== 'object') return clone(base);
  const next = { ...base, ...patch };
  next.persona = { ...base.persona, ...(patch.persona || {}) };
  next.publicProfile = mergePublicProfile(base.publicProfile, patch.publicProfile);
  next.privateProfile = mergePrivateProfile(base.privateProfile, patch.privateProfile);
  next.questionnaire = mergeQuestionnaire(base.questionnaire, patch.questionnaire);
  next.limits = { ...base.limits, ...(patch.limits || {}) };
  next.preferences = { ...base.preferences, ...(patch.preferences || {}) };
  next.safety = mergeSafety(base.safety, patch.safety);
  next.inventory = mergeInventory(base.inventory, patch.inventory || patch);
  next.analytics = { ...base.analytics, ...(patch.analytics || {}) };
  next.security = { ...base.security, ...(patch.security || {}) };
  next.profilePhotos = mergeProfilePhotos(base.profilePhotos, patch.profilePhotos);
  next.sceneTemplates = Array.isArray(patch.sceneTemplates)
    ? clone(patch.sceneTemplates)
    : clone(base.sceneTemplates);
  next.hypnosisPresets = Array.isArray(patch.hypnosisPresets)
    ? clone(patch.hypnosisPresets)
    : clone(base.hypnosisPresets);
  return next;
}

function mergeSafety(base, patch = {}) {
  const reference = base || defaultProfile().safety;
  return {
    breath: { ...reference.breath, ...(patch.breath || {}) },
    tickling: patch.tickling || reference.tickling,
    masochism: patch.masochism || reference.masochism,
    medical: Array.isArray(patch.medical) ? clone(patch.medical) : clone(reference.medical),
    safewords: { ...reference.safewords, ...(patch.safewords || {}) }
  };
}

function mergeInventory(base, patch = {}) {
  const next = { ...base, ...(patch.inventory ? patch.inventory : patch) };
  next.items = Array.isArray(next.items) ? clone(next.items) : [];
  next.metaVersion = next.metaVersion || base.metaVersion;
  return next;
}

function mergePublicProfile(base, patch = {}) {
  const reference = base || defaultProfile().publicProfile;
  const next = { ...reference, ...patch };
  next.tags = Array.isArray(patch.tags)
    ? clone(patch.tags)
    : Array.isArray(reference.tags)
      ? clone(reference.tags)
      : [];
  return next;
}

function mergePrivateProfile(base, patch = {}) {
  const reference = base || defaultProfile().privateProfile;
  return { ...reference, ...patch };
}

function mergeQuestionnaire(base, patch = {}) {
  const reference = base || buildQuestionnaireDefaults();
  const next = { ...reference };
  next.persona = { ...reference.persona, ...(patch.persona || {}) };
  const patchSections = patch.sections || {};
  const mergedSections = {};
  Object.keys(reference.sections || {}).forEach((key) => {
    mergedSections[key] = { ...reference.sections[key] };
    const incoming = patchSections[key];
    if (incoming && typeof incoming === 'object') {
      Object.keys(incoming).forEach((option) => {
        if (typeof incoming[option] === 'string') {
          mergedSections[key][option] = incoming[option];
        }
      });
    }
  });
  Object.keys(patchSections).forEach((key) => {
    if (!mergedSections[key] && typeof patchSections[key] === 'object') {
      mergedSections[key] = { ...patchSections[key] };
    }
  });
  next.sections = mergedSections;
  return next;
}

function mergeProfilePhotos(base, patch = {}) {
  const reference = base || { main: '', additional: ['', '', '', ''] };
  const additional = Array.isArray(reference.additional)
    ? reference.additional.slice(0, 4)
    : ['', '', '', ''];
  const next = {
    main: reference.main || '',
    additional: additional.map((value) => value || '')
  };
  if (typeof patch.main === 'string') {
    next.main = patch.main;
  }
  if (Array.isArray(patch.additional)) {
    patch.additional.slice(0, 4).forEach((value, idx) => {
      if (typeof value === 'string') {
        next.additional[idx] = value;
      }
    });
  }
  return next;
}

function persistBundle() {
  if (!initialised) return;
  const payload = {
    profiles: bundle.profiles,
    activeId: bundle.activeId
  };
  safeStorage('set', PROFILE_BUNDLE_KEY, JSON.stringify(payload));
  const active = bundle.profiles[bundle.activeId];
  if (active) syncLegacy(active);
}

function syncLegacy(profile) {
  safeStorage('set', LEGACY_NAME_KEY, profile.profileName || '');
  const items = Array.isArray(profile.inventory?.items) ? profile.inventory.items : [];
  safeStorage('set', LEGACY_ITEM_KEY, JSON.stringify({ items }));
}

function loadLegacyItems() {
  const payload = safeReadJSON(LEGACY_ITEM_KEY);
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}

function safeReadJSON(key) {
  const raw = safeStorage('get', key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function safeStorage(action, key, value) {
  try {
    if (action === 'get') return window.localStorage?.getItem(key) || null;
    if (action === 'set') window.localStorage?.setItem(key, value);
    if (action === 'remove') window.localStorage?.removeItem(key);
  } catch (err) {
    console.warn('[profileStore] Storage unavailable', err);
  }
  return null;
}

function ensureInitialised() {
  if (!initialised) init();
}

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix) {
  const id = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  return prefix ? `${prefix}-${id}` : id;
}

function emit(event, detail) {
  const listeners = eventMap.get(event);
  if (!listeners) return;
  listeners.forEach((cb) => {
    try {
      cb(detail);
    } catch (err) {
      console.warn('[profileStore] Listener failed', err);
    }
  });
}

export const profileStore = {
  init,
  getActiveProfile,
  setActiveProfile,
  getProfileName,
  setProfileName,
  setPublicProfile,
  setPrivateProfile,
  getInventoryItems,
  replaceInventoryItems,
  exportActiveProfile,
  importProfile,
  update,
  on
};
