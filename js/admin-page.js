import { listProfiles, fetchProfile } from './profile-sync-client.js';

const dom = {
  profileInput: document.querySelector('[data-admin-profile-input]'),
  loadButton: document.getElementById('adminLoadProfile'),
  pullButton: document.getElementById('adminPullRemote'),
  refreshButton: document.getElementById('adminRefreshList'),
  status: document.getElementById('adminStatus'),
  summary: document.getElementById('adminProfileSummary'),
  list: document.getElementById('adminProfileList'),
  profileJson: document.getElementById('adminProfileJson')
};

function init() {
  bindEvents();
  refreshProfiles();
  updateStatus('Admin ready.', 'success');
}

function bindEvents() {
  dom.refreshButton?.addEventListener('click', refreshProfiles);
  dom.loadButton?.addEventListener('click', () => loadProfileFromInput('manual'));
  dom.pullButton?.addEventListener('click', () => loadProfileFromInput('remote'));
  dom.list?.addEventListener('click', handleProfileListClick);
}

async function refreshProfiles() {
  if (!dom.list) return;
  updateStatus('Fetching stored profiles…', 'loading');
  try {
    const payload = await listProfiles();
    const profiles = payload?.profiles || [];
    renderProfileList(profiles);
    updateStatus(`Loaded ${profiles.length} profiles.`, 'success');
  } catch (error) {
    updateStatus(error?.message || 'Unable to fetch profiles.', 'error');
  }
}

function renderProfileList(profiles = []) {
  if (!dom.list) return;
  if (!profiles.length) {
    dom.list.innerHTML = '<p class="metadata small">No profiles stored yet.</p>';
    return;
  }
  dom.list.innerHTML = profiles.map((entry) => {
    const label = entry.metadata?.profileName || entry.profileId;
    const version = entry.metadata?.version ? `v${entry.metadata.version}` : 'vN/A';
    return `
      <div class="admin-profile-line">
        <div class="admin-profile-meta">
          <strong>${escapeAttribute(label)}</strong>
          <span class="metadata">${entry.profileId}</span>
          <span class="metadata">${version}</span>
        </div>
        <button type="button" class="btn secondary btn-sm" data-admin-load="${entry.profileId}">Load</button>
      </div>
    `;
  }).join('');
}

function handleProfileListClick(evt) {
  const target = evt.target.closest('[data-admin-load]');
  if (!target) return;
  const profileId = target.dataset.adminLoad;
  loadProfileById(profileId);
}

function loadProfileFromInput(mode) {
  const profileId = (dom.profileInput?.value || '').trim();
  if (!profileId) {
    updateStatus('Provide a profile ID first.', 'error');
    return;
  }
  loadProfileById(profileId);
}

async function loadProfileById(profileId) {
  updateStatus('Loading profile from KV…', 'loading');
  try {
    const profile = await fetchProfile(profileId);
    if (!profile) {
      updateStatus('Profile not found.', 'error');
      return;
    }
    renderSummary(profile);
    renderProfileJson(profile);
    updateStatus(`Loaded ${profile.profileId}.`, 'success');
  } catch (error) {
    updateStatus(error?.message || 'Failed to load profile.', 'error');
  }
}

function renderSummary(profile) {
  if (!dom.summary) return;
  dom.summary.innerHTML = `
    <div class="admin-summary-row">
      <span>ID</span>
      <strong>${escapeAttribute(profile.profileId)}</strong>
    </div>
    <div class="admin-summary-row">
      <span>Name</span>
      <strong>${escapeAttribute(profile.profileName || 'Unnamed')}</strong>
    </div>
    <div class="admin-summary-row">
      <span>Version</span>
      <strong>${profile.version || 'N/A'}</strong>
    </div>
  `;
}

function renderProfileJson(profile) {
  if (!dom.profileJson) return;
  try {
    dom.profileJson.value = JSON.stringify(profile, null, 2);
  } catch (error) {
    dom.profileJson.value = 'Unable to serialize profile.';
  }
}

function updateStatus(message, tone = 'info') {
  if (!dom.status) return;
  dom.status.textContent = message;
  dom.status.dataset.tone = tone;
}

function escapeAttribute(value) {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

window.addEventListener('DOMContentLoaded', init);
