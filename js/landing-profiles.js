import { profileStore } from './profile-store.js';

const dom = {
  form: document.getElementById('quickProfileForm'),
  name: document.getElementById('quickProfileName'),
  intent: document.getElementById('quickIntent'),
  summary: document.getElementById('quickSummary'),
  tags: document.getElementById('quickTags'),
  role: document.getElementById('quickRole'),
  tone: document.getElementById('quickTone'),
  aura: document.getElementById('quickAura'),
  createTester: document.getElementById('createTesterProfile'),
  activeName: document.getElementById('activeProfileName'),
  summaryIntent: document.getElementById('summaryIntent'),
  summaryTags: document.getElementById('summaryTags'),
  summaryPersona: document.getElementById('summaryPersona'),
  feedback: document.getElementById('quickProfileFeedback')
};

const FEEDBACK_DEFAULT = 'Saving is local until Cloudflare sync.';
let feedbackTimer;

function init() {
  profileStore.init();
  dom.form?.addEventListener('submit', handleSubmit);
  dom.createTester?.addEventListener('click', createTesterProfile);
  profileStore.on('profile:updated', renderSummary);
  renderSummary();
  updateFeedback(FEEDBACK_DEFAULT);
}

function handleSubmit(event) {
  event.preventDefault();
  const name = (dom.name?.value || '').trim();
  const intent = (dom.intent?.value || '').trim();
  const summary = (dom.summary?.value || '').trim();
  const tags = parseList(dom.tags?.value || '');
  profileStore.update((draft) => {
    if (name) draft.profileName = name;
    draft.persona = {
      ...draft.persona,
      role: dom.role?.value || draft.persona?.role,
      tone: dom.tone?.value || draft.persona?.tone,
      nounAura: dom.aura?.value || draft.persona?.nounAura
    };
    draft.publicProfile = {
      ...draft.publicProfile,
      intent,
      summary,
      tags
    };
  }, { fields: ['profileName', 'persona', 'publicProfile'] });
  updateFeedback('Quick profile saved locally.');
}

function createTesterProfile() {
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const name = `Beta tester ${timestamp}`;
  const payload = {
    profileName: name,
    persona: { role: 'switch', tone: 'dominant', nounAura: 'neutral' },
    publicProfile: {
      intent: 'Collect beta feedback + inventory alignment.',
      summary: 'Testing tonight’s runs, tracking safety, and preserving hypnotic themes.',
      tags: ['beta', 'tester']
    }
  };
  profileStore.importProfile(payload, { activate: true });
  renderSummary();
  updateFeedback('Created and activated a new tester profile.');
}

function renderSummary() {
  const profile = profileStore.getActiveProfile();
  if (!profile) return;
  dom.activeName.textContent = profile.profileName || 'Untitled profile';
  dom.summaryIntent.textContent = profile.publicProfile?.intent || 'Intent pending';
  dom.summaryTags.textContent = (profile.publicProfile?.tags || []).join(', ') || 'No tags yet';
  dom.summaryPersona.textContent = `${profile.persona?.role || 'switch'} · ${profile.persona?.tone || 'dominant'} · ${profile.persona?.nounAura || 'neutral'}`;
  setValue(dom.name, profile.profileName);
  setValue(dom.intent, profile.publicProfile?.intent);
  setValue(dom.summary, profile.publicProfile?.summary);
  setValue(dom.tags, (profile.publicProfile?.tags || []).join(', '));
  setValue(dom.role, profile.persona?.role);
  setValue(dom.tone, profile.persona?.tone);
  setValue(dom.aura, profile.persona?.nounAura);
}

function parseList(input) {
  return input
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function setValue(element, value) {
  if (!element) return;
  element.value = value ?? '';
}

function updateFeedback(message, tone = 'info') {
  if (!dom.feedback) return;
  dom.feedback.textContent = message;
  dom.feedback.dataset.state = tone;
  clearTimeout(feedbackTimer);
  if (tone !== 'loading') {
    feedbackTimer = setTimeout(() => {
      dom.feedback.textContent = FEEDBACK_DEFAULT;
    }, 4200);
  }
}

init();
