import { profileStore } from './profile-store.js';
import { loadQuestionBank } from './question-bank.js';
import { fetchProfile, upsertProfile } from './profile-sync-client.js';

const dom = {
  personaHonorific: document.querySelector('[data-persona-honorific]'),
  personaRole: document.querySelector('[data-persona-role]'),
  personaTone: document.querySelector('[data-persona-tone]'),
  personaAura: document.querySelector('[data-persona-aura]'),
  pronouns: document.querySelector('[data-pronouns]'),
  personaSceneNames: document.querySelector('[data-persona-scene-names]'),
  personaDisposition: document.querySelector('[data-persona-disposition]'),
  profileSubtitle: document.querySelector('[data-profile-subtitle]'),
  profileBio: document.querySelector('[data-public-bio]'),
  hardLimits: document.querySelector('[data-hard-limits]'),
  softLimits: document.querySelector('[data-soft-limits]'),
  limitNotes: document.querySelector('[data-limit-notes]'),
  breathIntensity: document.querySelector('[data-breath-intensity]'),
  breathExperience: document.querySelector('[data-breath-experience]'),
  tickling: document.querySelector('[data-tickling]'),
  masochismScale: document.querySelector('[data-masochism-scale]'),
  medicalNotes: document.querySelector('[data-medical-notes]'),
  safewordPrimary: document.querySelector('[data-safeword-primary]'),
  safewordSecondary: document.querySelector('[data-safeword-secondary]'),
  safewordMuffled: document.querySelector('[data-safeword-muffled]'),
  safewordNonverbal: document.querySelector('[data-safeword-nonverbal]'),
  negotiationNotes: document.querySelector('[data-negotiation-notes]'),
  aftercarePlan: document.querySelector('[data-aftercare-plan]'),
  riskNotes: document.querySelector('[data-risk-notes]'),
  savePublicProfile: document.getElementById('savePublicProfile'),
  savePrivateProfile: document.getElementById('savePrivateProfile'),
  arsenalList: document.getElementById('arsenalList'),
  arsenalCount: document.getElementById('arsenalCount'),
  gearList: document.getElementById('gearList'),
  fetishList: document.getElementById('fetishList'),
  presetList: document.getElementById('presetList'),
  syncCloud: document.getElementById('syncCloud'),
  loadCloud: document.getElementById('loadCloud'),
  refreshLocal: document.getElementById('refreshLocal'),
  syncStatus: document.getElementById('syncStatus'),
  personaPosition: document.querySelector('[data-questionnaire-persona="position"]'),
  personaDynamic: document.querySelector('[data-questionnaire-persona="dynamic"]'),
  saveQuestionnaire: document.getElementById('saveQuestionnaire'),
  questionnaireStatus: document.getElementById('questionnaireStatus'),
  questionnairePrev: document.getElementById('questionnairePrev'),
  questionnaireNext: document.getElementById('questionnaireNext'),
  questionnaireTabs: document.getElementById('questionnaireTabs'),
  questionnaireContent: document.getElementById('questionnaireContent'),
  profileNameDisplayPanel: document.querySelector('[data-profile-name-display-panel]'),
  panelProfileName: document.querySelector('[data-panel-profile-name]'),
  panelProfileSubtitle: document.querySelector('[data-panel-profile-subtitle]'),
  tagPicker: document.getElementById('publicTagPicker'),
  selectedTagsContainer: document.querySelector('[data-selected-tags]'),
  tagDropdown: document.querySelector('[data-tag-dropdown]'),
  tagDropdownContainer: document.querySelector('[data-tag-dropdown-container]'),
  autoBioBlock: document.getElementById('autoBioBlock'),
  saveBubblePublic: document.querySelector('[data-save-bubble="public"]'),
  saveBubblePrivate: document.querySelector('[data-save-bubble="private"]'),
  saveBubbleQuestionnaire: document.querySelector('[data-save-bubble="questionnaire"]'),
  mainPhotoPreview: document.querySelector('[data-photo-preview="main"]'),
  mainPhotoInput: document.getElementById('mainProfilePhotoInput'),
  additionalPhotoInputs: Array.from(document.querySelectorAll('[data-additional-photo-input]')),
  additionalPhotoPreviews: Array.from(document.querySelectorAll('[data-photo-preview^="additional"]'))
};

const statusDefaults = {
  idle: 'No sync actions yet.'
};

const QUESTIONNAIRE_IDLE_STATUS = 'Select the interest chips for each category and save to lock them in.';
const QUESTIONNAIRE_DIRTY_STATUS = 'Unsaved questionnaire changes detected.';
const QUESTIONNAIRE_STATUS_CHOICES = [
  { key: 'love', label: 'Love' },
  { key: 'like', label: 'Like' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'dislike', label: 'Dislike' },
  { key: 'limit', label: 'Limit' }
];
const QUESTIONNAIRE_STATUS_KEYS = new Set(QUESTIONNAIRE_STATUS_CHOICES.map((choice) => choice.key));
const questionnaireState = {
  categories: loadQuestionBank(),
  index: 0,
  dirty: false
};
const saveBubbleMessages = {
  dirty: 'Unsaved changes',
  saved: 'Saved!',
  idle: ''
};
const saveBubbleMap = {
  public: dom.saveBubblePublic,
  private: dom.saveBubblePrivate,
  questionnaire: dom.saveBubbleQuestionnaire
};

function init() {
  profileStore.init();
  bindEvents();
  renderAll();
  updateStatus(statusDefaults.idle, 'info');
}

function bindEvents() {
  dom.savePublicProfile?.addEventListener('click', handleSavePublicProfile);
  dom.savePrivateProfile?.addEventListener('click', handleSavePrivateProfile);
  dom.syncCloud?.addEventListener('click', async () => {
    try {
      await syncProfileToCloud();
    } catch (error) {
      updateStatus(`Cloud sync failed: ${error.message}`, 'error');
    }
  });
  dom.loadCloud?.addEventListener('click', async () => {
    try {
      await loadProfileFromCloud();
    } catch (error) {
      updateStatus(`Unable to load remote profile: ${error.message}`, 'error');
    }
  });
  dom.refreshLocal?.addEventListener('click', () => {
    renderAll();
    updateStatus('Local view refreshed.', 'info');
  });
  dom.saveQuestionnaire?.addEventListener('click', handleSaveQuestionnaire);
  dom.questionnairePrev?.addEventListener('click', () => changeQuestionnaireIndex(-1));
  dom.questionnaireNext?.addEventListener('click', () => changeQuestionnaireIndex(1));
  dom.questionnaireTabs?.addEventListener('click', handleQuestionnaireTabClick);
  dom.questionnaireContent?.addEventListener('click', handleQuestionnaireStatusClick);
  dom.personaPosition?.addEventListener('change', () => markQuestionnaireDirty());
  dom.personaDynamic?.addEventListener('change', () => markQuestionnaireDirty());
  dom.tagPicker?.addEventListener('click', handleTagPickerClick);
  dom.tagDropdown?.addEventListener('change', handleTagDropdownChange);
  dom.selectedTagsContainer?.addEventListener('click', handleSelectedTagClick);
  watchSectionDirty('#publicProfilePanel', 'public');
  watchSectionDirty('#playProfilePanel', 'private');
  dom.mainPhotoInput?.addEventListener('change', (evt) => handlePhotoUpload(evt, 'main'));
  dom.additionalPhotoInputs?.forEach((input) => {
    input.addEventListener('change', (evt) => handlePhotoUpload(evt, 'additional'));
  });
}

function watchSectionDirty(selector, sectionKey) {
  const fields = document.querySelectorAll(`${selector} input, ${selector} select, ${selector} textarea`);
  fields.forEach((field) => {
    const handler = () => setSaveBubble(sectionKey, 'dirty');
    field.addEventListener('input', handler);
    field.addEventListener('change', handler);
  });
}

function setSaveBubble(sectionKey, status = 'idle') {
  const element = saveBubbleMap[sectionKey];
  if (!element) return;
  const message = saveBubbleMessages[status] || '';
  element.textContent = message;
  element.classList.toggle('save-bubble--dirty', status === 'dirty');
  element.classList.toggle('save-bubble--saved', status === 'saved');
  element.style.visibility = message ? 'visible' : 'hidden';
}

function renderAll() {
  const profile = profileStore.getActiveProfile();
  if (!profile) return;
  renderProfileNameDisplay(profile);
  renderProfileSubtitleDisplay(profile);
  setValue(dom.personaHonorific, profile.persona?.honorific);
  setValue(dom.personaRole, profile.persona?.role || 'switch');
  setValue(dom.personaTone, profile.persona?.tone || 'dominant');
  setValue(dom.personaAura, profile.persona?.nounAura || 'neutral');
  setValue(dom.personaSceneNames, (profile.persona?.sceneNames || []).join(', '));
  setValue(dom.personaDisposition, profile.persona?.disposition || 'Balanced');
  setValue(dom.pronouns, profile.publicProfile?.pronouns);
  setValue(dom.profileSubtitle, profile.publicProfile?.subtitle || profile.publicProfile?.intent || '');
  setValue(dom.profileBio, profile.publicProfile?.bio || profile.publicProfile?.summary || '');
  setValue(dom.hardLimits, formatLines(profile.limits?.hard));
  setValue(dom.softLimits, formatLines(profile.limits?.soft));
  setValue(dom.limitNotes, profile.limits?.notes);
  setValue(dom.breathIntensity, profile.safety?.breath?.intensity || 'Medium');
  setValue(dom.breathExperience, profile.safety?.breath?.experience || 'New');
  setValue(dom.tickling, profile.safety?.tickling || 'Moderate');
  setValue(dom.masochismScale, profile.safety?.masochism || 'Moderate');
  setValue(dom.medicalNotes, formatLines(profile.safety?.medical));
  setValue(dom.safewordPrimary, profile.safety?.safewords?.primary);
  setValue(dom.safewordSecondary, profile.safety?.safewords?.secondary);
  setValue(dom.safewordNonverbal, formatTags(profile.safety?.safewords?.nonverbal));
  setValue(dom.negotiationNotes, profile.privateProfile?.negotiationNotes);
  setValue(dom.aftercarePlan, profile.privateProfile?.aftercarePlan);
  setValue(dom.riskNotes, profile.privateProfile?.riskNotes);
  renderArsenal(profile.inventory?.items || []);
  renderHypnotics(profile);
  renderQuestionnaire(profile);
  renderTagPicker(profile);
  renderBioBlock(profile);
  renderPhotoPreviews(profile);
  setSaveBubble('public', 'saved');
  setSaveBubble('private', 'saved');
  setSaveBubble('questionnaire', 'saved');
}

function handleSavePublicProfile() {
  profileStore.update((draft) => {
    draft.persona = {
      role: dom.personaRole?.value || draft.persona.role,
      honorific: (dom.personaHonorific?.value || '').trim(),
      nounAura: dom.personaAura?.value || draft.persona.nounAura,
      tone: dom.personaTone?.value || draft.persona.tone,
      sceneNames: parseList(dom.personaSceneNames?.value || '', ','),
      disposition: dom.personaDisposition?.value || draft.persona.disposition || 'Balanced'
    };
    draft.publicProfile = {
      ...draft.publicProfile,
      pronouns: (dom.pronouns?.value || '').trim(),
      subtitle: (dom.profileSubtitle?.value || '').trim(),
      bio: (dom.profileBio?.value || '').trim()
    };
  }, { fields: ['persona', 'publicProfile'] });
  updateStatus('Public profile saved locally.', 'success');
  setSaveBubble('public', 'saved');
  renderAll();
}

function handleSavePrivateProfile() {
  profileStore.update((draft) => {
    draft.limits = {
      hard: parseList(dom.hardLimits?.value || '', '\n'),
      soft: parseList(dom.softLimits?.value || '', '\n'),
      notes: (dom.limitNotes?.value || '').trim()
    };
    draft.safety = {
      ...draft.safety,
      breath: {
        ...draft.safety?.breath,
        intensity: dom.breathIntensity?.value || 'Medium',
        experience: dom.breathExperience?.value || 'New'
      },
      tickling: dom.tickling?.value || draft.safety?.tickling || 'Moderate',
      masochism: dom.masochismScale?.value || draft.safety?.masochism || 'Moderate',
      medical: parseList(dom.medicalNotes?.value || '', '\n'),
      safewords: {
        ...draft.safety?.safewords,
        primary: (dom.safewordPrimary?.value || '').trim(),
        secondary: (dom.safewordSecondary?.value || '').trim(),
        muffled: (dom.safewordMuffled?.value || '').trim(),
        nonverbal: parseList(dom.safewordNonverbal?.value || '', ',')
      }
    };
    draft.privateProfile = {
      ...draft.privateProfile,
      negotiationNotes: (dom.negotiationNotes?.value || '').trim(),
      aftercarePlan: (dom.aftercarePlan?.value || '').trim(),
      riskNotes: (dom.riskNotes?.value || '').trim()
    };
  }, { fields: ['limits', 'safety', 'privateProfile'] });
  updateStatus('Private profile saved locally.', 'success');
  setSaveBubble('private', 'saved');
  renderAll();
}

function renderArsenal(items) {
  if (dom.arsenalCount) {
    dom.arsenalCount.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
  }
  if (!dom.arsenalList) return;
  dom.arsenalList.innerHTML = '';
  if (!items.length) {
    dom.arsenalList.textContent = 'No Arsenal entries yet.';
    return;
  }
  items.slice(0, 6).forEach((item) => {
    const entry = document.createElement('div');
    entry.className = 'list-item';
    const title = document.createElement('strong');
    title.textContent = item.name || item.title || 'Untitled gear';
    const detail = document.createElement('div');
    detail.className = 'metadata';
    detail.textContent = item.category || item.type || 'General';
    entry.appendChild(title);
    entry.appendChild(detail);
    dom.arsenalList.appendChild(entry);
  });
}

function renderHypnotics(profile) {
  populateList(dom.gearList, profile.preferences?.gear, 'No gear cues saved.');
  const fetishEntries = [...(profile.preferences?.fetishes || []), ...(profile.preferences?.personaCues || [])];
  populateList(dom.fetishList, fetishEntries, 'Add some hypnotic preferences.');
  if (!dom.presetList) return;
  dom.presetList.innerHTML = '';
  const presets = profile.hypnosisPresets || [];
  if (!presets.length) {
    dom.presetList.textContent = 'No hypnosis presets defined.';
    return;
  }
  presets.forEach((preset) => {
    const entry = document.createElement('div');
    entry.className = 'list-item';
    const title = document.createElement('strong');
    title.textContent = preset.title || 'Untitled preset';
    entry.appendChild(title);
    if (preset.phase) {
      const phase = document.createElement('div');
      phase.className = 'metadata';
      phase.textContent = `Phase: ${preset.phase}`;
      entry.appendChild(phase);
    }
    if (preset.notes) {
      const notes = document.createElement('div');
      notes.textContent = preset.notes;
      notes.style.fontSize = '12px';
      notes.style.color = '#9ea5b3';
      notes.style.marginTop = '4px';
      entry.appendChild(notes);
    }
  dom.presetList.appendChild(entry);
  });
}

function renderPhotoPreviews(profile) {
  const photos = profile.profilePhotos || { main: '', additional: ['', '', '', ''] };
  setPhotoPreview(dom.mainPhotoPreview, photos.main);
  dom.additionalPhotoPreviews?.forEach((element, index) => {
    setPhotoPreview(element, photos.additional?.[index] || '');
  });
}

function renderProfileNameDisplay(profile) {
  const name = profile.profileName || 'Unnamed profile';
  if (dom.profileNameDisplayPanel) dom.profileNameDisplayPanel.textContent = name;
  if (dom.panelProfileName) dom.panelProfileName.textContent = name;
}

function renderProfileSubtitleDisplay(profile) {
  const subtitle = profile.publicProfile?.subtitle || profile.publicProfile?.intent || '';
  if (dom.panelProfileSubtitle) dom.panelProfileSubtitle.textContent = subtitle;
}

function renderBioBlock(profile) {
  if (dom.autoBioBlock) {
    dom.autoBioBlock.innerHTML = composeAutoBio(profile);
  }
}

function renderTagPicker(profile) {
  if (!dom.tagPicker) return;
  const candidates = computeCandidateTags(profile);
  const selected = profile.publicProfile?.tags || [];
  if (!candidates.length) {
    dom.tagPicker.innerHTML = '<div class="metadata">Answer the questionnaire to unlock curated tags.</div>';
    renderSelectedTags(selected);
    renderTagDropdown(profile, candidates, selected);
    return;
  }
  dom.tagPicker.innerHTML = candidates.map((tag) => `
    <button type="button" class="tag-chip ${selected.includes(tag) ? 'active' : ''}" data-tag="${escapeAttribute(tag)}">
      ${tag}
    </button>
  `).join('');
  renderSelectedTags(profile);
  renderTagDropdown(profile, candidates, selected);
}

function renderSelectedTags(profile) {
  if (!dom.selectedTagsContainer) return;
  const selected = profile.publicProfile?.tags || [];
  if (!selected.length) {
    dom.selectedTagsContainer.innerHTML = '<span class="metadata">No tags selected yet.</span>';
    return;
  }
  const topTags = selected.slice(0, 5);
  dom.selectedTagsContainer.innerHTML = topTags.map((tag) => {
    const safeTag = escapeAttribute(tag);
    return `
      <span class="selected-tag" data-selected-tag="${safeTag}">
        ${safeTag}
        <button type="button" aria-label="Remove ${safeTag}">×</button>
      </span>
    `;
  }).join('');
}

function renderTagDropdown(profile, candidates, selected) {
  if (!dom.tagDropdown || !dom.tagDropdownContainer) return;
  if (selected.length) {
    dom.tagDropdownContainer.classList.add('hidden');
    return;
  }
  if (!candidates.length) {
    dom.tagDropdownContainer.classList.add('hidden');
    return;
  }
  dom.tagDropdownContainer.classList.remove('hidden');
  const options = candidates.map((tag) => `<option value="${escapeAttribute(tag)}">${tag}</option>`).join('');
  dom.tagDropdown.innerHTML = `<option value="">Add a tag</option>${options}`;
}

function handleTagPickerClick(evt) {
  const chip = evt.target.closest('[data-tag]');
  if (!chip) return;
  const tag = chip.dataset.tag;
  if (!tag) return;
  const profile = profileStore.getActiveProfile();
  const tags = profile.publicProfile?.tags || [];
  if (tags.includes(tag)) {
    removeTag(tag);
  } else {
    addTag(tag);
  }
}

function handleTagDropdownChange(evt) {
  const value = evt.target.value;
  if (!value) return;
  addTag(value);
  evt.target.value = '';
}

function handleSelectedTagClick(evt) {
  const chip = evt.target.closest('[data-selected-tag]');
  if (!chip) return;
  const tag = chip.dataset.selectedTag;
  if (!tag) return;
  removeTag(tag);
}

function addTag(tag) {
  const profile = profileStore.getActiveProfile();
  const tags = profile.publicProfile?.tags || [];
  if (tags.includes(tag)) return;
  if (tags.length >= 5) {
    updateStatus('Display up to five tags.', 'error');
    return;
  }
  profileStore.update((draft) => {
    const current = Array.isArray(draft.publicProfile?.tags) ? [...draft.publicProfile.tags] : [];
    current.push(tag);
    draft.publicProfile = { ...draft.publicProfile, tags: current };
  }, { fields: ['publicProfile'] });
  updateStatus('Tag selection updated.', 'success');
  renderTagPicker(profileStore.getActiveProfile());
  renderBioBlock(profileStore.getActiveProfile());
}

function removeTag(tag) {
  const profile = profileStore.getActiveProfile();
  const tags = profile.publicProfile?.tags || [];
  if (!tags.includes(tag)) return;
  const next = tags.filter((value) => value !== tag);
  profileStore.update((draft) => {
    draft.publicProfile = { ...draft.publicProfile, tags: next };
  }, { fields: ['publicProfile'] });
  updateStatus('Tag selection updated.', 'success');
  renderTagPicker(profileStore.getActiveProfile());
  renderBioBlock(profileStore.getActiveProfile());
}


function computeCandidateTags(profile) {
  const sections = profile.questionnaire?.sections || {};
  const scores = {};
  Object.values(sections).forEach((section) => {
    Object.entries(section || {}).forEach(([option, status]) => {
      const weight = status === 'love' ? 3 : status === 'like' ? 2 : status === 'neutral' ? 1 : 0;
      if (!weight) return;
      if (!scores[option] || weight > scores[option]) {
        scores[option] = weight;
      }
    });
  });
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([option]) => option);
}

function composeAutoBio(profile) {
  const persona = profile.persona || {};
  const disposition = persona.disposition || 'Balanced';
  const position = profile.questionnaire?.persona?.sexualPosition || 'Top';
  const dynamic = profile.questionnaire?.persona?.sexualDynamic || 'Dom';
  const love = gatherStatusOptions(profile, ['love'], 3);
  const like = gatherStatusOptions(profile, ['like'], 3);
  const limit = gatherStatusOptions(profile, ['limit'], 3);
  const tags = profile.publicProfile?.tags || [];
  const sections = [
    {
      label: 'Disposition',
      value: `${escapeAttribute(disposition)} · ${escapeAttribute(persona.role || 'scene architect')} · ${escapeAttribute(persona.nounAura || 'neutral')}`
    },
    {
      label: 'Scene energy',
      value: `${escapeAttribute(position)} / ${escapeAttribute(dynamic)}`
    }
  ];
  const highlights = [];
  if (love.length) highlights.push({ label: 'Loves', values: love, tone: 'love' });
  if (like.length) highlights.push({ label: 'Likes', values: like, tone: 'like' });
  if (limit.length) highlights.push({ label: 'Limits', values: limit, tone: 'limit' });
  if (tags.length) highlights.push({ label: 'Tags', values: tags.slice(0, 5), tone: 'tag' });
  return [
    sections.map((section) => `
      <div class="auto-bio-row">
        <span class="auto-bio-label">${section.label}</span>
        <span class="auto-bio-value">${section.value}</span>
      </div>
    `).join(''),
    highlights.map((highlight) => `
      <div class="auto-bio-row">
        <span class="auto-bio-label">${highlight.label}</span>
        <span class="auto-bio-highlight">
          ${highlight.values.map((value) => `<span class="auto-bio-chip auto-bio-chip--${highlight.tone}">${escapeAttribute(value)}</span>`).join('')}
        </span>
      </div>
    `).join('')
  ].join('');
}

function gatherStatusOptions(profile, statuses = ['love'], limit = 3) {
  const sections = profile.questionnaire?.sections || {};
  const collected = [];
  Object.values(sections).forEach((section) => {
    Object.entries(section || {}).forEach(([option, status]) => {
      if (!statuses.includes(status)) return;
      if (!collected.includes(option)) {
        collected.push(option);
      }
    });
  });
  return collected.slice(0, limit);
}

function setPhotoPreview(element, value) {
  if (!element) return;
  if (value) {
    element.style.backgroundImage = `url(${value})`;
    element.dataset.filled = 'true';
  } else {
    element.style.backgroundImage = '';
    element.dataset.filled = 'false';
  }
}

function setQuestionnaireStatus(message, tone = 'info') {
  if (!dom.questionnaireStatus) return;
  dom.questionnaireStatus.textContent = message;
  dom.questionnaireStatus.dataset.tone = tone;
}

function renderQuestionnaire(profile) {
  if (!dom.questionnaireContent) return;
  const categories = loadQuestionBank();
  if (!categories.length) {
    dom.questionnaireContent.innerHTML = '<p class="small">Question bank not available.</p>';
    return;
  }
  questionnaireState.categories = categories;
  questionnaireState.index = Math.min(Math.max(questionnaireState.index, 0), categories.length - 1);
  const category = questionnaireState.categories[questionnaireState.index];
  const selections = profile.questionnaire?.sections || {};
  const personaPositionEl = dom.personaPosition;
  const personaDynamicEl = dom.personaDynamic;
  if (personaPositionEl) {
    personaPositionEl.value = profile.questionnaire?.persona?.sexualPosition || personaPositionEl.value || 'Top';
  }
  if (personaDynamicEl) {
    personaDynamicEl.value = profile.questionnaire?.persona?.sexualDynamic || personaDynamicEl.value || 'Dom';
  }
  renderQuestionnaireTabs();
  renderQuestionnaireContent(category, selections[category.id] || {});
  updateQuestionnaireNavButtons();
  if (!questionnaireState.dirty) {
    setQuestionnaireStatus(QUESTIONNAIRE_IDLE_STATUS, 'info');
  }
}

function renderQuestionnaireTabs() {
  if (!dom.questionnaireTabs) return;
  dom.questionnaireTabs.innerHTML = questionnaireState.categories
    .map((category, idx) => `
      <button type="button" class="questionnaire-tab ${idx === questionnaireState.index ? 'active' : ''}" data-index="${idx}">
        ${category.label}
      </button>
    `).join('');
}

function renderQuestionnaireContent(category, selections = {}) {
  if (!dom.questionnaireContent || !category) return;
  const options = category.options.map((entry) => {
    const status = selections[entry] || 'neutral';
    const safeLabel = escapeAttribute(entry);
    const buttons = QUESTIONNAIRE_STATUS_CHOICES.map((choice) => `
      <button
        type="button"
        class="status-chip ${choice.key === status ? 'active' : ''}"
        data-questionnaire-option="${escapeAttribute(entry)}"
        data-questionnaire-status="${choice.key}"
      >
        ${choice.label}
      </button>
    `).join('');
    return `
      <div class="question-option">
        <span class="option-label">${safeLabel}</span>
        <div class="status-palette">
          ${buttons}
        </div>
      </div>
    `;
  }).join('');
  dom.questionnaireContent.innerHTML = `
    <div class="question-block">
      <h3>${category.label}</h3>
      <p class="small">${category.description}</p>
      ${options}
    </div>
  `;
}

function handleSaveQuestionnaire() {
  updateStatus('Questionnaire saved locally.', 'success');
  setQuestionnaireStatus('Questionnaire saved locally.', 'success');
  markQuestionnaireDirty(false);
  setSaveBubble('questionnaire', 'saved');
  renderQuestionnaire(profileStore.getActiveProfile());
}

function changeQuestionnaireIndex(delta) {
  if (!questionnaireState.categories.length) return;
  const nextIndex = Math.min(Math.max(questionnaireState.index + delta, 0), questionnaireState.categories.length - 1);
  if (nextIndex === questionnaireState.index) return;
  questionnaireState.index = nextIndex;
  renderQuestionnaire(profileStore.getActiveProfile());
}

function handleQuestionnaireTabClick(evt) {
  const tab = evt.target.closest('.questionnaire-tab');
  if (!tab) return;
  const targetIndex = Number(tab.dataset.index);
  if (Number.isNaN(targetIndex) || targetIndex === questionnaireState.index) return;
  questionnaireState.index = targetIndex;
  renderQuestionnaire(profileStore.getActiveProfile());
}

function handleQuestionnaireStatusClick(evt) {
  const button = evt.target.closest('[data-questionnaire-option]');
  if (!button) return;
  const option = button.dataset.questionnaireOption;
  const status = button.dataset.questionnaireStatus;
  if (!option || !status || !QUESTIONNAIRE_STATUS_KEYS.has(status)) return;
  const category = questionnaireState.categories[questionnaireState.index];
  if (!category) return;
  profileStore.update((draft) => {
    draft.questionnaire = draft.questionnaire || {};
    draft.questionnaire.sections = draft.questionnaire.sections || {};
    const sections = draft.questionnaire.sections;
    const section = sections[category.id] || {};
    sections[category.id] = { ...section, [option]: status };
    draft.questionnaire.sections = sections;
  }, { fields: ['questionnaire'] });
  markQuestionnaireDirty(true);
  renderQuestionnaire(profileStore.getActiveProfile());
  renderTagPicker(profileStore.getActiveProfile());
  renderBioBlock(profileStore.getActiveProfile());
}

async function handlePhotoUpload(evt, slot) {
  const files = evt.target?.files;
  if (!files?.length) return;
  const file = files[0];
  const index = slot === 'additional' ? Number(evt.target.dataset.index) : null;
  try {
    updateStatus('Saving photo...', 'loading');
    const dataUrl = await readFileAsDataURL(file);
    await savePhotoData(slot, index, dataUrl);
    renderPhotoPreviews(profileStore.getActiveProfile());
    updateStatus('Photo saved locally.', 'success');
  } catch (error) {
    updateStatus('Unable to read photo.', 'error');
    console.error('[photoUpload]', error);
  } finally {
    evt.target.value = '';
  }
}

function savePhotoData(slot, index, dataUrl) {
  return profileStore.update((draft) => {
    draft.profilePhotos = draft.profilePhotos || { main: '', additional: ['', '', '', ''] };
    const photos = {
      main: draft.profilePhotos.main || '',
      additional: Array.isArray(draft.profilePhotos.additional)
        ? draft.profilePhotos.additional.slice(0, 4)
        : ['', '', '', '']
    };
    if (slot === 'main') {
      photos.main = dataUrl;
    } else if (typeof index === 'number' && index >= 0 && index < photos.additional.length) {
      photos.additional[index] = dataUrl;
    }
    draft.profilePhotos = photos;
  }, { fields: ['profilePhotos'] });
}

function updateQuestionnaireNavButtons() {
  if (dom.questionnairePrev) {
    dom.questionnairePrev.disabled = questionnaireState.index <= 0;
  }
  if (dom.questionnaireNext) {
    dom.questionnaireNext.disabled = questionnaireState.index >= questionnaireState.categories.length - 1;
  }
}

function markQuestionnaireDirty(value = true) {
  questionnaireState.dirty = value;
  if (value) {
    setQuestionnaireStatus(QUESTIONNAIRE_DIRTY_STATUS, 'error');
  } else {
    setQuestionnaireStatus(QUESTIONNAIRE_IDLE_STATUS, 'info');
  }
  setSaveBubble('questionnaire', value ? 'dirty' : 'idle');
}

function escapeAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decodeHtml(value) {
  if (!value) return '';
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function populateList(container, values, emptyMessage) {
  if (!container) return;
  container.innerHTML = '';
  if (!values || !values.length) {
    container.textContent = emptyMessage;
    return;
  }
  values.forEach((value) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.textContent = value?.toString() || '';
    container.appendChild(item);
  });
}

async function syncProfileToCloud() {
  const profile = profileStore.getActiveProfile();
  if (!profile) {
    updateStatus('No active profile to sync.', 'error');
    return;
  }
  const payload = buildSyncPayload(profile);
  updateStatus('Syncing to Cloudflare...', 'loading');
  const parsed = await upsertProfile(profile.profileId, payload);
  const timestamp = parsed?.metadata?.syncedAt || parsed?.metadata?.updatedAt || new Date().toISOString();
  updateStatus(`Synced at ${new Date(timestamp).toLocaleTimeString()}.`, 'success');
  return parsed;
}

async function loadProfileFromCloud() {
  const profile = profileStore.getActiveProfile();
  if (!profile) {
    updateStatus('No active profile to load.', 'error');
    return;
  }
  updateStatus('Loading remote bundle...', 'loading');
  const payload = await fetchProfile(profile.profileId);
  if (!payload) {
    updateStatus('No remote profile stored yet.', 'info');
    return;
  }
  mergeRemoteProfile(payload);
  renderAll();
  updateStatus('Remote bundle merged locally.', 'success');
}

function mergeRemoteProfile(remote) {
  if (!remote || typeof remote !== 'object') return;
  profileStore.update((draft) => {
    if (remote.profileName) draft.profileName = remote.profileName;
    if (remote.persona) draft.persona = { ...draft.persona, ...remote.persona };
    if (remote.publicProfile) draft.publicProfile = { ...draft.publicProfile, ...remote.publicProfile };
    if (remote.privateProfile) draft.privateProfile = { ...draft.privateProfile, ...remote.privateProfile };
    if (remote.limits) draft.limits = { ...draft.limits, ...remote.limits };
    if (remote.safety) {
      draft.safety = draft.safety || {};
      draft.safety.breath = { ...draft.safety.breath, ...(remote.safety.breath || {}) };
      draft.safety.intensity = { ...draft.safety.intensity, ...(remote.safety.intensity || {}) };
      if (Array.isArray(remote.safety.medical)) {
        draft.safety.medical = remote.safety.medical.slice();
      }
      draft.safety.safewords = { ...draft.safety.safewords, ...(remote.safety.safewords || {}) };
    }
    if (remote.arsenal?.items) {
      draft.inventory = draft.inventory || {};
      draft.inventory.items = remote.arsenal.items.map((item) => ({ ...item }));
      if (remote.arsenal.metaVersion) draft.inventory.metaVersion = remote.arsenal.metaVersion;
    }
    if (remote.hypnosis?.preferences) {
      draft.preferences = { ...draft.preferences, ...remote.hypnosis.preferences };
    }
    if (Array.isArray(remote.hypnosis?.presets)) {
      draft.hypnosisPresets = remote.hypnosis.presets.map((preset) => ({ ...preset }));
    }
    if (remote.questionnaire) {
      const existingSections = draft.questionnaire?.sections || {};
      const incomingSections = remote.questionnaire.sections || {};
      const mergedSections = { ...existingSections };
      Object.keys(existingSections).forEach((key) => {
        if (Array.isArray(incomingSections[key])) {
          mergedSections[key] = incomingSections[key].slice();
        }
      });
      Object.keys(incomingSections).forEach((key) => {
        if (!mergedSections[key]) mergedSections[key] = Array.isArray(incomingSections[key]) ? incomingSections[key].slice() : [];
      });
      draft.questionnaire = {
        ...draft.questionnaire,
        persona: { ...draft.questionnaire?.persona, ...(remote.questionnaire.persona || {}) },
        sections: mergedSections
      };
    }
    if (remote.profilePhotos) {
      const additional = Array.isArray(remote.profilePhotos.additional)
        ? remote.profilePhotos.additional.slice(0, 4).map((value) => value || '')
        : ['', '', '', ''];
      draft.profilePhotos = {
        main: remote.profilePhotos.main || '',
        additional
      };
    }
    if (remote.analytics) {
      draft.analytics = { ...draft.analytics, ...remote.analytics };
    }
  }, { fields: ['profileName', 'persona', 'publicProfile', 'privateProfile', 'limits', 'safety', 'inventory', 'preferences', 'hypnosisPresets', 'questionnaire', 'profilePhotos'] });
}

function buildSyncPayload(profile) {
  return {
    profileId: profile.profileId,
    profileName: profile.profileName,
    persona: profile.persona,
    publicProfile: profile.publicProfile,
    privateProfile: profile.privateProfile,
    limits: profile.limits,
    safety: profile.safety,
    arsenal: {
      items: profile.inventory?.items || [],
      metaVersion: profile.inventory?.metaVersion
    },
  hypnosis: {
    preferences: profile.preferences,
    presets: profile.hypnosisPresets
  },
  questionnaire: profile.questionnaire,
  analytics: profile.analytics,
    metadata: {
      syncedAt: new Date().toISOString(),
      source: 'client'
    }
  };
}

function parseList(value, separator = ',') {
  if (!value) return [];
  return value
    .split(separator)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = () => reject(reader.error || new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

function formatLines(list) {
  if (!list || !list.length) return '';
  return list.join('\n');
}

function formatTags(list) {
  if (!list || !list.length) return '';
  return list.join(', ');
}

function setValue(element, value) {
  if (!element) return;
  element.value = value ?? '';
}

function updateStatus(message, tone = 'info') {
  if (!dom.syncStatus) return;
  dom.syncStatus.textContent = message || statusDefaults.idle;
  dom.syncStatus.dataset.tone = tone;
}

init();
