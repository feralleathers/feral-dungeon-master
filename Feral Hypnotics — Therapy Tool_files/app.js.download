import { loadTopics, flattenTopicPhrases } from './topicsStore.js';
import { HypnoGenerator, PHASES } from './generator.js';
import { KINK_PHRASES, KINK_TOPIC_OPTIONS, applyPhraseOverrides } from './library.js';

const DRAFT_KEY = 'fdm_hyp_poetry_drafts.v1';
const PERSONAS = [
  { id: 'sub', label: 'Sub', icon: '🧷' },
  { id: 'bdsm_sub', label: 'BDSM Sub', icon: '🖤' },
  { id: 'slave', label: 'Slave', icon: '⛓️' },
  { id: 'drone', label: 'Drone', icon: '🛰' },
  { id: 'pup', label: 'Pup', icon: '🐺' },
  { id: 'kitten', label: 'Kitten', icon: '🐱' },
  { id: 'doll', label: 'Doll', icon: '🪆' },
  { id: 'boy', label: 'Boy', icon: '🧢' },
  { id: 'jock', label: 'Jock', icon: '🏈' }
];

const STUDIO_THEMES = {
  steel: { bpm: 70, volume: 0.12, layers: ['drone', 'pulse', 'chains'] },
  clinic: { bpm: 60, volume: 0.1, layers: ['pulse', 'hiss', 'binaural_theta'] },
  ember: { bpm: 80, volume: 0.14, layers: ['drone', 'pulse', 'rain'] }
};

const PHASE_TITLES = {
  arrival: 'Overture (Arrival)',
  induction: 'Verse I (Induction)',
  deepening: 'Bridge (Deepening)',
  play: 'Chorus (Climax & Play)',
  release: 'Finale (Come-down & Aftercare)'
};

applyPhraseOverrides();

const REQUEST_STORAGE_KEY = 'fdm_phrase_studio_requests.v1';

const PERSONA_TONE_TEMPLATES = {
  default: {
    base: [
      '{{NOUN}}, breathe slow and stay exactly where I place you.',
      'Every syllable I drip rethreads you, {{NOUN}}.',
      '{{NOUN}}, you soften deeper the longer I speak.'
    ],
    praise: [
      'Good {{NOUN}}, soak up my warmth until it leaks out of you.',
      '{{NOUN}}, you glow because I say you please me.'
    ],
    worship: [
      '{{NOUN}}, worship every hum of my voice as scripture.',
      'Devotion tastes like iron on your tongue, {{NOUN}}.'
    ],
    'praise+worship': [
      'Good {{NOUN}}, worship flows through your body like current.',
      '{{NOUN}}, praise and worship braid together whenever I pet you.'
    ],
    control: [
      '{{NOUN}}, you surrender control of breath, pulse, and thought.',
      'Only my cadence decides what you feel, {{NOUN}}.'
    ],
    humiliation: [
      '{{NOUN}}, every taunt lands because you crave exposure.',
      'You blush harder the more I announce your place, {{NOUN}}.'
    ]
  },
  pup: {
    base: [
      '{{NOUN}}, settle at my boot and listen.',
      'Tail low, ears open, {{NOUN}}.'
    ],
    praise: [
      'Good {{NOUN}}, every wag proves you heard me.',
      '{{NOUN}}, your heart thumps "good dog" on loop.'
    ],
    worship: [
      '{{NOUN}}, worship every scratch behind your ear.',
      'Your leash is a rosary in your teeth, {{NOUN}}.'
    ],
    'praise+worship': [
      'Good {{NOUN}}, you worship the hand praising you.',
      'Praise-soaked worship makes you drool, {{NOUN}}.'
    ],
    control: [
      '{{NOUN}}, heel. I move, you follow.',
      'My boot nudges you quiet, {{NOUN}}.'
    ]
  },
  slave: {
    base: [
      '{{NOUN}}, remember your worth is measured in obedience.',
      'You kneel because every cell knows it must, {{NOUN}}.'
    ],
    control: [
      '{{NOUN}}, I pull the strings and you shiver.',
      'Control tastes like leather on your tongue, {{NOUN}}.'
    ],
    humiliation: [
      '{{NOUN}}, you live to be displayed.',
      'Every command stains you with devotion, {{NOUN}}.'
    ]
  },
  drone: {
    base: [
      '{{NOUN}}, process the directive and comply.',
      'Firmware update complete, {{NOUN}}.'
    ],
    control: [
      '{{NOUN}} obeys newest protocol without hesitation.',
      'Servo calm until I spark motion, {{NOUN}}.'
    ]
  }
};

const PERSONA_NOUNS = {
  default: { auto: 'good subject', boy: 'good boy', girl: 'good girl', pet: 'good pet' },
  sub: { auto: 'good sub', boy: 'good boy', girl: 'good girl', pet: 'good pet' },
  bdsm_sub: { auto: 'obedient sub', boy: 'obedient boy', girl: 'obedient girl', pet: 'obedient pet' },
  slave: { auto: 'good slave', boy: 'good boy slave', girl: 'good girl slave', pet: 'obedient beast' },
  drone: { auto: 'obedient drone', boy: 'obedient boy drone', girl: 'obedient girl drone', pet: 'perfect unit' },
  pup: { auto: 'good pup', boy: 'good boy', girl: 'good girl', pet: 'good dog' },
  kitten: { auto: 'soft kitten', boy: 'good tom', girl: 'good kitten', pet: 'purring pet' },
  doll: { auto: 'precious doll', boy: 'polished doll', girl: 'porcelain doll', pet: 'obedient toy' },
  boy: { auto: 'good boy', boy: 'good boy', girl: 'good girl', pet: 'good toy' },
  jock: { auto: 'good jock', boy: 'good boy', girl: 'good champ', pet: 'good beast' }
};

const MAX_KINK_TOPICS = 24;
const KINK_SELECTION_KEY = 'fdm_kink_grid_selection';
const DEFAULT_KINK_SELECTION = [
  'abdl',
  'anal_play',
  'anal_focus',
  'bondage',
  'chastity',
  'cocksuck',
  'drone',
  'edging',
  'feet',
  'fetish',
  'gear',
  'hypnosis',
  'impact',
  'interaction',
  'machine',
  'muscle',
  'nipple',
  'pet',
  'piss',
  'power',
  'rubber',
  'scene',
  'sensation',
  'slave'
];


const LAYER_FACTORIES = {
  drone(ctx, master) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 55;
    gain.gain.value = 0.04;
    osc.connect(gain).connect(master);
    osc.start();
    return { stop() { try { osc.stop(); } catch (err) {} } };
  },
  pulse(ctx, master, options = {}) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 70;
    gain.gain.value = 0;
    osc.connect(gain).connect(master);
    osc.start();
    let timer = null;
    const schedule = bpm => {
      const interval = 60000 / bpm;
      timer = setInterval(() => {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      }, interval);
    };
    schedule(options.bpm || 72);
    return {
      stop() { if (timer) clearInterval(timer); try { osc.stop(); } catch (err) {} },
      update(newOpts) {
        if (timer) clearInterval(timer);
        schedule(newOpts?.bpm || 72);
      }
    };
  },
  chains(ctx, master) {
    const gain = ctx.createGain();
    gain.gain.value = 0.07;
    gain.connect(master);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 300;
    filter.connect(gain);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * 0.6;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.start();
    noise.connect(filter);
    return { stop() { try { noise.stop(); } catch (err) {} } };
  },
  hiss(ctx, master) {
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    filter.connect(gain).connect(master);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * 0.4;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.start();
    noise.connect(filter);
    return { stop() { try { noise.stop(); } catch (err) {} } };
  },
  binaural_theta: createBinauralLayer(5),
  binaural_delta: createBinauralLayer(2),
  rain(ctx, master) {
    const gain = ctx.createGain();
    gain.gain.value = 0.02;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;
    filter.connect(gain).connect(master);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * 0.3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.start();
    noise.connect(filter);
    return { stop() { try { noise.stop(); } catch (err) {} } };
  }
};

function createBinauralLayer(beatHz) {
  return function (ctx, master) {
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';
    const base = 180;
    oscL.frequency.value = base - beatHz / 2;
    oscR.frequency.value = base + beatHz / 2;
    const panL = ctx.createStereoPanner();
    const panR = ctx.createStereoPanner();
    panL.pan.value = -0.6;
    panR.pan.value = 0.6;
    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    gainL.gain.value = 0.04;
    gainR.gain.value = 0.04;
    oscL.connect(gainL).connect(panL).connect(master);
    oscR.connect(gainR).connect(panR).connect(master);
    oscL.start();
    oscR.start();
    return {
      stop() {
        try { oscL.stop(); } catch (err) {}
        try { oscR.stop(); } catch (err) {}
      }
    };
  };
}

const dom = {};
const generator = new HypnoGenerator();
let topics = [];
let library = [];
let drafts = {};
let activeTopicId = null;
let activeSubId = null;
let activePersona = 'sub';
let reinforcementSet = new Set(['any']);
let userEditedWords = false;
let activeNounTone = 'auto';
let activeNounAura = 'neutral';
let selectedKinkTopics = [];
let phrasePreviewLines = [];
let requestEntries = [];
let requestStatusDefault = '';

const studioState = { ctx: null, master: null, layerNodes: {}, bpm: 72 };

window.addEventListener('DOMContentLoaded', init);

function init() {
  mapDom();
  if (dom.personaNoun) dom.personaNoun.value = activeNounTone;
  renderNounAuraButtons();
  updatePhraseFeedControls();
  updateSidePanelAnchors();
  window.addEventListener('resize', updateSidePanelAnchors);
  initKinkGrid();
  drafts = loadDrafts();
  hydratePhaseSelect();
  hydrateDraftSelect();
  renderPersonaList();
  wireEvents();
  updateReinforceButtons();
  requestEntries = loadRequestEntries();
  renderRequestFeed();
  initRequestPanel();
  loadTopics()
    .then(result => {
      topics = result;
      library = flattenTopicPhrases(result);
      activeTopicId = topics[0]?.id || null;
      activeSubId = topics[0]?.subs?.[0]?.id || null;
      hydrateTopicSelect();
      renderSubList();
      renderPhraseList();
      renderTimeline();
      updateSuggestedTags();
    })
    .catch(err => {
      dom.phraseList.innerHTML = `<p class="small">${err.message}</p>`;
    });
}

function mapDom() {
  dom.wrap = document.querySelector('.wrap');
  dom.timeline = document.getElementById('poetryTimeline');
  dom.suggestedTags = document.getElementById('poSuggestedTags');
  dom.notes = document.getElementById('poNotes');
  dom.topicSelect = document.getElementById('poTopicSelect');
  dom.phraseList = document.getElementById('poPhraseList');
  dom.targetPhase = document.getElementById('poTargetPhase');
  dom.addAll = document.getElementById('poAddAll');
  dom.personaList = document.getElementById('poPersonaList');
  dom.personaNoun = document.getElementById('poPersonaNoun');
  dom.nounAuraButtons = document.querySelectorAll('.nounAuraToggle button');
  dom.reinforceButtons = document.querySelectorAll('.reinforceSwitch button');
  dom.draftSelect = document.getElementById('poDraftSelect');
  dom.loadDraft = document.getElementById('poLoadDraft');
  dom.resetDraft = document.getElementById('poResetDraft');
  dom.saveDraft = document.getElementById('poSaveDraft');
  dom.saveDraftSide = document.getElementById('poSaveDraftSide');
  dom.exportDraft = document.getElementById('poExportDraft');
  dom.exportOutput = document.getElementById('poExportOutput');
  dom.scriptOutput = document.getElementById('poScriptOutput');
  dom.scriptPhraseList = document.getElementById('poScriptPhraseList');
  dom.scriptSectionList = document.getElementById('poScriptSectionList');
  dom.phrasePlay = document.getElementById('poPhrasePlay');
  dom.phraseSync = document.getElementById('poPhraseSync');
  dom.studioTheme = document.getElementById('studioTheme');
  dom.studioStart = document.getElementById('studioStart');
  dom.studioStop = document.getElementById('studioStop');
  dom.studioBpm = document.getElementById('studioBpm');
  dom.studioBpmNumber = document.getElementById('studioBpmNumber');
  dom.studioVolume = document.getElementById('studioVolume');
  dom.studioVolumeNumber = document.getElementById('studioVolumeNumber');
  dom.studioStatus = document.getElementById('studioStatus');
  dom.studioPremium = document.getElementById('studioPremium');
  dom.studioLayers = Array.from(document.querySelectorAll('.studioLayer'));
  dom.syncWordsBtn = document.getElementById('poSyncWords');
  dom.wordInput = document.getElementById('words');
  dom.sideToggles = document.querySelectorAll('.sideToggle');
  dom.sidePanels = document.querySelectorAll('.sidepanel');
  dom.kinkGrid = document.getElementById('kinkGrid');
  dom.kinkChecklist = document.getElementById('kinkChecklist');
  dom.kinkCount = document.getElementById('kinkSelectionCount');
  dom.kinkReset = document.getElementById('kinkResetDefaults');
  dom.requestForm = document.getElementById('poRequestForm');
  dom.requestFeed = document.getElementById('poRequestFeed');
  dom.requestStatus = document.getElementById('poRequestStatus');
  if (dom.requestStatus) {
    requestStatusDefault = dom.requestStatus.textContent || '';
  }
}

function updateSidePanelAnchors() {
  if (!dom.wrap) return;
  const rect = dom.wrap.getBoundingClientRect();
  document.documentElement.style.setProperty('--wrap-left', `${rect.left}px`);
  document.documentElement.style.setProperty('--wrap-width', `${rect.width}px`);
}

function hydratePhaseSelect() {
  const options = PHASES.map(phase => `<option value="${phase.id}">${phase.label}</option>`).join('');
  if (dom.targetPhase) dom.targetPhase.innerHTML = options;
}

function renderPersonaList() {
  if (!dom.personaList) return;
  dom.personaList.innerHTML = PERSONAS.map(persona => {
    const active = persona.id === activePersona ? 'active' : '';
    return `<button class="personaPill ${active}" data-persona="${persona.id}">${persona.icon} ${persona.label}</button>`;
  }).join('');
  updateKinkPhrasePreview();
}

function renderNounAuraButtons() {
  if (!dom.nounAuraButtons) return;
  dom.nounAuraButtons.forEach(btn => {
    if (!btn.dataset.aura) return;
    btn.classList.toggle('active', btn.dataset.aura === activeNounAura);
  });
}

function hydrateTopicSelect() {
  if (!dom.topicSelect) return;
  if (!topics.length) {
    dom.topicSelect.innerHTML = '<option value="">Loading topics…</option>';
    return;
  }
  dom.topicSelect.innerHTML = topics
    .map(topic => `<option value="${topic.id}">${topic.label}</option>`)
    .join('');
  if (activeTopicId) {
    dom.topicSelect.value = activeTopicId;
  }
  dom.topicSelect.onchange = () => selectTopic(dom.topicSelect.value);
}

function renderTimeline() {
  if (!dom.timeline) return;
  const phases = generator.getTimeline();
  dom.timeline.innerHTML = phases
    .map(phase => {
      const blocks = phase.blocks.length
        ? phase.blocks.map((block, idx) => renderTimelineBlock(block, phase.id, idx)).join('')
        : `<div class="small" style="opacity:.7">No lines yet. Pull kinks from the right rail.</div>`;
      return `
        <div class="phaseColumn" data-phase="${phase.id}">
          <h4>${phase.label}</h4>
          <p>${phase.desc}</p>
          <div class="phaseBlocks">${blocks}</div>
          <button class="btn ghost" data-action="focus-phase" data-phase="${phase.id}">+ Invite verse</button>
        </div>
      `;
    })
    .join('');
  syncWordsFromTimeline();
  updateScriptOutput();
}

function renderTimelineBlock(block, phaseId, idx) {
  const tagMarkup = (block.tags || []).map(tag => `<span class="badge">${tag}</span>`).join('');
  const personaTag = block.persona ? `<span class="badge">${block.persona}</span>` : '';
  return `
    <div class="poBlock">
      <small>${block.type || 'line'} — ${block.tone || 'tone'}</small>
      <p>${block.text}</p>
      <div class="poTagList">${personaTag}${tagMarkup}</div>
      <button class="btn ghost" data-action="remove-block" data-phase="${phaseId}" data-index="${idx}">Remove</button>
    </div>
  `;
}

function renderPhraseList() {
  if (!dom.phraseList) return;
  const blocks = getBlocksForSub(activeTopicId, activeSubId);
  if (!blocks.length) {
    dom.phraseList.innerHTML = '<p class="small">Choose a sub-scene above to see its phrases.</p>';
    return;
  }
  const targetLabel = getPhaseLabel(dom.targetPhase?.value || 'arrival');
  dom.phraseList.innerHTML = blocks
    .map(block => `
      <div class="phraseCard">
        <p>${block.text}</p>
        <footer>
          <span class="badge">${block.type}</span>
          <span class="badge">${block.tone}</span>
          <span class="badge">${block.reinforcement || 'tone'}</span>
          <button class="btn" data-action="add-block" data-id="${block.id}">Add to ${targetLabel}</button>
        </footer>
      </div>
    `)
    .join('');
}

function getBlocksForSub(topicId, subId) {
  return library.filter(block => {
    if (block.topicId !== topicId || block.subId !== subId) return false;
    if (!matchesPersona(block, activePersona)) return false;
    if (!matchesReinforcement(block)) return false;
    return true;
  });
}

function matchesPersona(block, persona) {
  if (!persona) return true;
  if (!block.personas || !block.personas.length) return true;
  return block.personas.includes(persona);
}

function matchesReinforcement(block) {
  if (reinforcementSet.has('any')) return true;
  const tone = block.reinforcement || 'any';
  return reinforcementSet.has(tone);
}

function toggleReinforcement(value) {
  if (!value) return;
  if (value === 'any') {
    reinforcementSet = new Set(['any']);
  } else {
    if (reinforcementSet.has('any')) reinforcementSet.delete('any');
    if (reinforcementSet.has(value)) {
      reinforcementSet.delete(value);
    } else {
      reinforcementSet.add(value);
    }
    if (!reinforcementSet.size) reinforcementSet.add('any');
  }
  updateReinforceButtons();
  renderPhraseList();
  updateKinkPhrasePreview();
}

function updateReinforceButtons() {
  dom.reinforceButtons?.forEach(btn => {
    const val = btn.dataset.tone;
    const active = reinforcementSet.has('any') ? val === 'any' : reinforcementSet.has(val);
    btn.classList.toggle('active', active);
  });
}

function getPrimaryReinforcement() {
  if (reinforcementSet.has('any')) return 'any';
  const first = reinforcementSet.values().next().value;
  return first || 'any';
}

function wireEvents() {
  dom.timeline?.addEventListener('click', evt => {
    if (evt.target.matches('[data-action="remove-block"]')) {
      const { phase, index } = evt.target.dataset;
      generator.removeBlock(phase, Number(index));
      renderTimeline();
      updateSuggestedTags();
      window.fdmTrack?.('hyp_poetry_remove', { phase });
    }
    if (evt.target.matches('[data-action="focus-phase"]')) {
      const { phase } = evt.target.dataset;
      if (dom.targetPhase) dom.targetPhase.value = phase;
    }
  });

  dom.phraseList?.addEventListener('click', evt => {
    if (!evt.target.matches('[data-action="add-block"]')) return;
    const blockId = evt.target.dataset.id;
    addBlockToTimeline(blockId);
  });

  dom.addAll?.addEventListener('click', () => {
    const blocks = getBlocksForSub(activeTopicId, activeSubId);
    blocks.forEach(block => addBlockToTimeline(block.id, false));
    renderTimeline();
    updateSuggestedTags();
  });

  dom.personaList?.addEventListener('click', evt => {
    const btn = evt.target.closest('[data-persona]');
    if (!btn) return;
    activePersona = btn.dataset.persona;
    renderPersonaList();
    renderPhraseList();
  });

  dom.personaNoun?.addEventListener('change', () => {
    activeNounTone = dom.personaNoun.value || 'auto';
    updateKinkPhrasePreview();
  });

  dom.nounAuraButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.aura) {
        activeNounAura = btn.dataset.aura;
        renderNounAuraButtons();
        if (activeNounTone === 'auto') {
          updateKinkPhrasePreview();
        }
      }
    });
  });

  dom.reinforceButtons?.forEach(btn => {
    btn.addEventListener('click', () => toggleReinforcement(btn.dataset.tone));
  });

  dom.phrasePlay?.addEventListener('click', () => {
    if (!phrasePreviewLines.length) return;
    if (typeof window.playPhraseFeed === 'function') {
      window.playPhraseFeed(phrasePreviewLines.slice());
    }
  });

  dom.phraseSync?.addEventListener('click', () => {
    if (!phrasePreviewLines.length || !dom.wordInput) return;
    dom.wordInput.value = phrasePreviewLines.join('\n');
    userEditedWords = false;
    if (typeof window.seqFromWords === 'function') {
      window.seqFromWords();
    }
  });

  dom.suggestedTags?.addEventListener('click', evt => {
    const tag = evt.target.dataset.tag;
    if (!tag) return;
    const match = library.find(block => block.tags?.includes(tag));
    if (match) {
      selectTopic(match.topicId);
      activeSubId = match.subId;
      renderSubList();
      renderPhraseList();
    }
  });

  dom.saveDraft?.addEventListener('click', () => {
    const name = prompt('Name this ritual draft', dom.draftSelect?.value || 'default');
    if (!name) return;
    drafts[name] = { ...generator.serialize(), notes: dom.notes?.value || '' };
    persistDrafts();
    hydrateDraftSelect(name);
    if (dom.draftSelect) dom.draftSelect.value = name;
    window.fdmTrack?.('hyp_poetry_save', { name });
  });
  dom.saveDraftSide?.addEventListener('click', () => dom.saveDraft?.click());

  dom.loadDraft?.addEventListener('click', () => {
    const name = dom.draftSelect?.value;
    if (!name || !drafts[name]) return;
    generator.hydrate(drafts[name], library);
    if (dom.notes) dom.notes.value = drafts[name].notes || '';
    renderTimeline();
    updateSuggestedTags();
    window.fdmTrack?.('hyp_poetry_load', { name });
  });

  dom.resetDraft?.addEventListener('click', () => {
    generator.reset();
    if (dom.notes) dom.notes.value = '';
    if (dom.exportOutput) dom.exportOutput.textContent = '';
    renderTimeline();
    updateSuggestedTags();
    userEditedWords = false;
    syncWordsFromTimeline(true);
  });

  dom.exportDraft?.addEventListener('click', () => {
    const payload = buildExportPayload();
    if (dom.exportOutput) {
      dom.exportOutput.textContent = payload.script + (payload.notes ? `\n\nNotes: ${payload.notes}` : '');
    }
    window.fdmTrack?.('hyp_poetry_export', { blocks: payload.count });
  });

  initStudioControls();

  dom.wordInput?.addEventListener('input', () => {
    userEditedWords = true;
  });

  dom.syncWordsBtn?.addEventListener('click', () => {
    userEditedWords = false;
    syncWordsFromTimeline(true);
  });

  dom.sideToggles?.forEach(btn => {
    btn.addEventListener('click', () => toggleSidePanel(btn.dataset.panel));
  });

}

function initKinkGrid() {
  selectedKinkTopics = loadKinkSelections();
  renderKinkChecklist();
  renderKinkGrid();
  dom.kinkReset?.addEventListener('click', resetKinkSelections);
}

function renderKinkGrid() {
  if (!dom.kinkGrid) return;
  const topics = selectedKinkTopics.slice(0, MAX_KINK_TOPICS).map(getTopicConfig).filter(Boolean);
  if (!topics.length) {
    dom.kinkGrid.innerHTML = '<p class="small">Use the Kink Grid Curator panel to pick which categories appear in the 4×6 matrix.</p>';
    updateKinkPhrasePreview();
    return;
  }
  dom.kinkGrid.innerHTML = topics.map(createKinkCardMarkup).join('');
  initKinkCards();
  updateKinkPhrasePreview();
}

function createKinkCardMarkup(topic) {
  const options = topic.options
    .map(opt => `<label><input type="checkbox" data-phrase="${opt.key}">${opt.label}</label>`)
    .join('');
  return `
    <div class="kinkCard" data-topic="${topic.id}">
      <header><label><input class="kinkMaster" type="checkbox"> ${topic.label}</label></header>
      <ul>${options}</ul>
    </div>
  `;
}

function renderKinkChecklist() {
  if (!dom.kinkChecklist) return;
  const selectedSet = new Set(selectedKinkTopics);
  const isFull = selectedKinkTopics.length >= MAX_KINK_TOPICS;
  const sorted = [...KINK_TOPIC_OPTIONS].sort((a, b) => a.label.localeCompare(b.label));
  dom.kinkChecklist.innerHTML = sorted.map(topic => {
    const checked = selectedSet.has(topic.id);
    const disabled = !checked && isFull;
    const disabledAttr = disabled ? 'disabled' : '';
    const disabledClass = disabled ? 'disabled' : '';
    return `
      <label class="${disabledClass}">
        <span>${topic.label}</span>
        <small>${topic.options.length} loops</small>
        <input type="checkbox" data-topic="${topic.id}" ${checked ? 'checked' : ''} ${disabledAttr}>
      </label>
    `;
  }).join('');
  dom.kinkChecklist.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => handleKinkChecklistToggle(input));
  });
  updateKinkSelectionCount();
}

function handleKinkChecklistToggle(input) {
  const topicId = input.dataset.topic;
  if (!topicId) return;
  if (input.checked) {
    if (selectedKinkTopics.length >= MAX_KINK_TOPICS) {
      input.checked = false;
      return;
    }
    if (!selectedKinkTopics.includes(topicId)) {
      selectedKinkTopics.push(topicId);
    }
  } else {
    selectedKinkTopics = selectedKinkTopics.filter(id => id !== topicId);
  }
  saveKinkSelections();
  renderKinkChecklist();
  renderKinkGrid();
}

function updateKinkSelectionCount() {
  if (dom.kinkCount) dom.kinkCount.textContent = selectedKinkTopics.length;
}

function loadKinkSelections() {
  try {
    const stored = JSON.parse(localStorage.getItem(KINK_SELECTION_KEY) || '[]');
    return sanitizeKinkSelection(Array.isArray(stored) ? stored : []);
  } catch (err) {
    return [...DEFAULT_KINK_SELECTION];
  }
}

function saveKinkSelections() {
  try {
    localStorage.setItem(KINK_SELECTION_KEY, JSON.stringify(selectedKinkTopics.slice(0, MAX_KINK_TOPICS)));
  } catch (err) {
    console.warn('Unable to persist kink grid selection', err);
  }
}

function resetKinkSelections() {
  selectedKinkTopics = [...DEFAULT_KINK_SELECTION];
  saveKinkSelections();
  renderKinkChecklist();
  renderKinkGrid();
}

function sanitizeKinkSelection(list = []) {
  const valid = [];
  const seen = new Set();
  list.forEach(id => {
    if (valid.length >= MAX_KINK_TOPICS) return;
    if (seen.has(id)) return;
    if (getTopicConfig(id)) {
      valid.push(id);
      seen.add(id);
    }
  });
  if (!valid.length) {
    DEFAULT_KINK_SELECTION.forEach(id => {
      if (valid.length >= MAX_KINK_TOPICS) return;
      if (!seen.has(id) && getTopicConfig(id)) {
        valid.push(id);
        seen.add(id);
      }
    });
  } else if (valid.length < MAX_KINK_TOPICS) {
    DEFAULT_KINK_SELECTION.forEach(id => {
      if (valid.length >= MAX_KINK_TOPICS) return;
      if (!seen.has(id) && getTopicConfig(id)) {
        valid.push(id);
        seen.add(id);
      }
    });
  }
  return valid;
}

function getTopicConfig(id) {
  return KINK_TOPIC_OPTIONS.find(topic => topic.id === id);
}

function initRequestPanel() {
  if (!dom.requestForm) return;
  setRequestStatus(requestStatusDefault || 'Requests stay saved locally until Premium unlocks.');
  dom.requestForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = new FormData(dom.requestForm);
    const entry = {
      category: (data.get('category') || '').trim(),
      subs: (data.get('subs') || '').trim(),
      phrases: (data.get('phrases') || '').trim(),
      notes: (data.get('notes') || '').trim(),
      createdAt: new Date().toISOString()
    };
    if (!entry.category && !entry.subs && !entry.phrases && !entry.notes) {
      setRequestStatus('Share at least one idea before sending.', false);
      return;
    }
    requestEntries.push(entry);
    saveRequestEntries(requestEntries);
    renderRequestFeed();
    dom.requestForm.reset();
    setRequestStatus('Saved locally! We’ll review it when Premium launches.', true);
  });
}

function renderRequestFeed() {
  if (!dom.requestFeed) return;
  if (!requestEntries.length) {
    dom.requestFeed.innerHTML = `
      <div class="requestCard muted">
        <header>
          <span>Awaiting submissions</span>
          <span class="requestMeta">Premium queue</span>
        </header>
        <p class="small">Sketch your dream categories and subs. We’ll spotlight them when the premium lane launches.</p>
      </div>
    `;
    return;
  }
  dom.requestFeed.innerHTML = requestEntries
    .slice()
    .reverse()
    .map(renderRequestCard)
    .join('');
}

function renderRequestCard(entry) {
  const category = entry.category ? escapeHtml(entry.category) : 'Untitled request';
  const chunks = [];
  if (entry.subs) {
    chunks.push(`<p class="small"><strong>Sub-scenes</strong><br>${formatMultiline(entry.subs)}</p>`);
  }
  if (entry.phrases) {
    chunks.push(`<p class="small"><strong>Phrase sparks</strong><br>${formatMultiline(entry.phrases)}</p>`);
  }
  if (entry.notes) {
    chunks.push(`<p class="small"><strong>Notes</strong><br>${formatMultiline(entry.notes)}</p>`);
  }
  if (!chunks.length) {
    chunks.push('<p class="small muted">No extra details provided.</p>');
  }
  return `
    <div class="requestCard">
      <header>
        <span>${category}</span>
        <span class="requestMeta">${formatRequestDate(entry.createdAt)}</span>
      </header>
      ${chunks.join('')}
    </div>
  `;
}

function setRequestStatus(message, vibe = null) {
  if (!dom.requestStatus) return;
  dom.requestStatus.textContent = message;
  if (vibe === true) {
    dom.requestStatus.style.color = '#9ad1c9';
  } else if (vibe === false) {
    dom.requestStatus.style.color = '#dba2a2';
  } else {
    dom.requestStatus.style.color = '#748089';
  }
}

function loadRequestEntries() {
  if (!canUseLocalStorage()) return [];
  try {
    const raw = localStorage.getItem(REQUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Unable to read custom category requests', err);
    return [];
  }
}

function saveRequestEntries(list) {
  if (!canUseLocalStorage()) return;
  try {
    localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Unable to persist custom category requests', err);
  }
}

function formatRequestDate(value) {
  try {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (err) {
    return 'New';
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatMultiline(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function selectTopic(topicId) {
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return;
  activeTopicId = topicId;
  activeSubId = topic.subs?.[0]?.id || null;
  if (dom.topicSelect && dom.topicSelect.value !== topicId) {
    dom.topicSelect.value = topicId;
  }
  renderSubList();
  renderPhraseList();
}

function addBlockToTimeline(blockId, rerender = true) {
  const block = library.find(b => b.id === blockId);
  if (!block) return;
  const phaseId = dom.targetPhase?.value || 'arrival';
  generator.addBlock(phaseId, block);
  if (rerender) {
    renderTimeline();
    updateSuggestedTags();
  }
  window.fdmTrack?.('hyp_poetry_add', { phase: phaseId, blockId: block.id });
}

function updateSuggestedTags() {
  if (!dom.suggestedTags) return;
  const tags = generator.collectTags();
  dom.suggestedTags.innerHTML = tags.length
    ? tags.map(tag => `<span class="badge" data-tag="${tag}">${tag}</span>`).join('')
    : '<span class="small">Add blocks to surface their tags for quick jumps.</span>';
}

function buildExportPayload() {
  const phases = generator.getTimeline();
  const parts = [];
  let count = 0;
  phases.forEach(phase => {
    if (!phase.blocks.length) return;
    parts.push(`// ${phase.label.toUpperCase()}`);
    phase.blocks.forEach(block => {
      parts.push(block.text);
      count += 1;
    });
    parts.push('');
  });
  const notes = dom.notes?.value.trim() || '';
  return {
    script: parts.join('\n').trim(),
    notes,
    tags: generator.collectTags(),
    moods: generator.collectMoods(),
    count,
    updatedAt: new Date().toISOString()
  };
}

function collectTimelineLines() {
  const lines = [];
  generator.getTimeline().forEach(phase => {
    phase.blocks.forEach(block => lines.push(block.text));
  });
  return lines;
}

function syncWordsFromTimeline(force = false) {
  if (!dom.wordInput) return;
  const lines = collectTimelineLines();
  if (!lines.length) return;
  if (!force && userEditedWords) return;
  dom.wordInput.value = lines.join('\n');
  userEditedWords = false;
  if (typeof window.seqFromWords === 'function') {
    window.seqFromWords();
  }
}

function updateScriptOutput() {
  if (!dom.scriptSectionList) return;
  const phases = generator.getTimeline();
  const sections = [];
  phases.forEach(phase => {
    if (!phase.blocks.length) return;
    const title = PHASE_TITLES[phase.id] || phase.label;
    const list = phase.blocks.map(block => `<li>${block.text}</li>`).join('');
    sections.push(`<div class="sectionBundle"><div class="bundleTitle">${title}</div><ol>${list}</ol></div>`);
  });
  dom.scriptSectionList.innerHTML = sections.length
    ? sections.join('')
    : '<em>Select personas and add ritual blocks to chart the scene outline.</em>';
}

function updateKinkPhrasePreview() {
  if (!dom.scriptPhraseList) return;
  const checked = Array.from(document.querySelectorAll('.kinkCard ul input[type="checkbox"][data-phrase]:checked'));
  phrasePreviewLines = [];
  if (!checked.length) {
    dom.scriptPhraseList.innerHTML = '<em>Tap kink sub-options to generate five-line packs that match your persona and reinforcement tone.</em>';
    updatePhraseFeedControls();
    return;
  }
  const noun = resolvePersonaNoun();
  const templates = getPersonaTemplatePool();
  const bundles = checked.map(input => renderKinkBundle(input.dataset.phrase, noun, templates)).filter(Boolean);
  dom.scriptPhraseList.innerHTML = bundles.length
    ? bundles.join('')
    : '<em>Phrase packs will appear once the library is linked to each kink toggle.</em>';
  updatePhraseFeedControls();
}

function renderKinkBundle(key, noun, templates) {
  const entry = KINK_PHRASES[key];
  if (!entry) return '';
  const overlays = (templates && templates.length ? templates : ['']).slice();
  const items = entry.phrases.map((line, idx) => {
    const template = overlays[idx % overlays.length] || '';
    const prefix = template ? template.replace(/\{\{NOUN\}\}/g, noun) : '';
    const combined = prefix ? `${prefix} ${line}` : line;
    phrasePreviewLines.push(combined);
    return `<li>${combined}</li>`;
  }).join('');
  return `<div class="phraseBundle"><div class="bundleTitle">${entry.group} • ${entry.label}</div><ol>${items}</ol></div>`;
}

function updatePhraseFeedControls() {
  const ready = phrasePreviewLines.length > 0;
  if (dom.phrasePlay) dom.phrasePlay.disabled = !ready;
  if (dom.phraseSync) dom.phraseSync.disabled = !ready;
}

function getPersonaTemplatePool() {
  const personaConfig = PERSONA_TONE_TEMPLATES[activePersona] || PERSONA_TONE_TEMPLATES.default;
  const defaultConfig = PERSONA_TONE_TEMPLATES.default;
  const keys = getTonePreferenceKeys();
  for (const key of keys) {
    if (personaConfig[key]) return personaConfig[key];
  }
  for (const key of keys) {
    if (defaultConfig[key]) return defaultConfig[key];
  }
  return defaultConfig.base;
}

function getTonePreferenceKeys() {
  const tones = Array.from(reinforcementSet).filter(t => t !== 'any').sort();
  const combos = [];
  if (tones.length > 1) combos.push(tones.join('+'));
  combos.push(...tones);
  combos.push('base');
  return combos;
}

function resolvePersonaNoun() {
  const lookup = PERSONA_NOUNS[activePersona] || PERSONA_NOUNS.default;
  const toneKey = activeNounTone === 'auto' ? resolveAuraTone() : activeNounTone;
  return lookup[toneKey] || lookup.auto || PERSONA_NOUNS.default.auto;
}

function resolveAuraTone() {
  if (activeNounAura === 'masc') return 'boy';
  if (activeNounAura === 'femme') return 'girl';
  return 'auto';
}

function hydrateDraftSelect(selected) {
  if (!dom.draftSelect) return;
  const names = Object.keys(drafts);
  dom.draftSelect.innerHTML = `<option value="">Load draft…</option>` + names.map(name => `<option value="${name}" ${selected === name ? 'selected' : ''}>${name}</option>`).join('');
}

function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
  } catch (err) {
    console.warn('Unable to parse drafts', err);
    return {};
  }
}

function persistDrafts() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

function getPhaseLabel(id) {
  const found = PHASES.find(phase => phase.id === id);
  return found ? found.label : 'Arrival';
}

function initStudioControls() {
  dom.studioStart?.addEventListener('click', startStudio);
  dom.studioStop?.addEventListener('click', stopStudio);
  dom.studioLayers?.forEach(layer => layer.addEventListener('change', () => handleLayerToggle(layer)));
  dom.studioBpm?.addEventListener('input', updateStudioBpm);
  dom.studioBpmNumber?.addEventListener('input', updateStudioBpmFromNumber);
  dom.studioVolume?.addEventListener('input', updateStudioVolume);
  dom.studioVolumeNumber?.addEventListener('input', updateStudioVolumeFromNumber);
  dom.studioTheme?.addEventListener('change', () => applyThemePreset(dom.studioTheme.value));
  dom.studioPremium?.addEventListener('click', () => alert('Custom track builder unlocks with the premium tier soon. Experiment while it\'s free.'));
  applyThemePreset(dom.studioTheme?.value || 'steel');
}

function startStudio() {
  if (studioState.ctx) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain();
  const startingVolume = parseFloat(dom.studioVolumeNumber?.value || dom.studioVolume?.value || '0.12');
  setStudioVolumeValue(startingVolume);
  master.gain.value = studioState.volume ?? startingVolume;
  master.connect(ctx.destination);
  studioState.ctx = ctx;
  studioState.master = master;
  const startingBpm = Number(dom.studioBpmNumber?.value || dom.studioBpm?.value || studioState.bpm || 72);
  setStudioBpmValue(startingBpm);
  applySelectedLayers();
  setStudioStatus('Atmosphere running.');
}

function stopStudio() {
  Object.values(studioState.layerNodes).forEach(node => node.stop?.());
  studioState.layerNodes = {};
  if (studioState.ctx) {
    try { studioState.ctx.close(); } catch (err) {}
  }
  studioState.ctx = null;
  studioState.master = null;
  setStudioStatus('Layers idle.');
}

function applySelectedLayers() {
  if (!studioState.ctx || !studioState.master) return;
  const selected = dom.studioLayers?.filter(layer => layer.checked).map(layer => layer.dataset.layer) || [];
  selected.forEach(startLayer);
}

function startLayer(layerId) {
  if (!studioState.ctx || !studioState.master || studioState.layerNodes[layerId]) return;
  const factory = LAYER_FACTORIES[layerId];
  if (!factory) return;
  const node = factory(studioState.ctx, studioState.master, { bpm: studioState.bpm });
  studioState.layerNodes[layerId] = node;
}

function handleLayerToggle(layer) {
  if (!studioState.ctx) return;
  if (layer.checked) {
    startLayer(layer.dataset.layer);
  } else {
    studioState.layerNodes[layer.dataset.layer]?.stop?.();
    delete studioState.layerNodes[layer.dataset.layer];
  }
}

function updateStudioBpm() {
  const value = Number(dom.studioBpm?.value || studioState.bpm || 72);
  setStudioBpmValue(value);
}

function updateStudioBpmFromNumber() {
  const value = Number(dom.studioBpmNumber?.value || studioState.bpm || 72);
  setStudioBpmValue(value);
}

function updateStudioVolume() {
  const value = parseFloat(dom.studioVolume?.value || studioState.volume || 0.12);
  setStudioVolumeValue(value);
}

function updateStudioVolumeFromNumber() {
  const value = parseFloat(dom.studioVolumeNumber?.value || studioState.volume || 0.12);
  setStudioVolumeValue(value);
}

function setStudioBpmValue(value) {
  const clamped = clampBpm(value);
  if (dom.studioBpm) dom.studioBpm.value = clamped;
  if (dom.studioBpmNumber) dom.studioBpmNumber.value = clamped;
  studioState.bpm = clamped;
  studioState.layerNodes.pulse?.update?.({ bpm: clamped });
}

function setStudioVolumeValue(value) {
  const clamped = Math.min(0.4, Math.max(0, Number(value) || 0));
  if (dom.studioVolume) dom.studioVolume.value = clamped;
  if (dom.studioVolumeNumber) dom.studioVolumeNumber.value = clamped.toFixed(2);
  studioState.volume = clamped;
  if (studioState.master) studioState.master.gain.value = clamped;
}

function applyThemePreset(themeId) {
  const preset = STUDIO_THEMES[themeId];
  if (!preset) return;
  setStudioBpmValue(preset.bpm);
  setStudioVolumeValue(preset.volume);
  dom.studioLayers?.forEach(layer => {
    layer.checked = preset.layers.includes(layer.dataset.layer);
  });
  if (studioState.ctx) {
    stopStudio();
    startStudio();
  }
}

function setStudioStatus(text) {
  if (dom.studioStatus) dom.studioStatus.textContent = text;
}

function clampBpm(value) {
  const num = Number(value) || 0;
  return Math.min(120, Math.max(40, Math.round(num / 5) * 5));
}

function toggleSidePanel(panelId) {
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.toggle('open');
}

function initKinkCards() {
  document.querySelectorAll('.kinkCard').forEach(card => {
    const master = card.querySelector('.kinkMaster');
    if (!master) return;
    const update = () => {
      card.classList.toggle('open', master.checked);
      if (!master.checked) {
        card.querySelectorAll('ul input[type="checkbox"]').forEach(box => {
          box.checked = false;
        });
      }
      updateKinkPhrasePreview();
    };
    master.addEventListener('change', update);
    card.addEventListener('click', evt => {
      if (evt.target === master) return;
      if (evt.target.closest('ul')) return;
      if (evt.target.closest('label') && evt.target.closest('ul')) return;
      evt.preventDefault();
      master.checked = !master.checked;
      master.dispatchEvent(new Event('change', { bubbles: false }));
    });
    card.querySelectorAll('ul input[type="checkbox"][data-phrase]').forEach(box => {
      box.addEventListener('change', () => {
        if (box.checked && !master.checked) {
          master.checked = true;
          master.dispatchEvent(new Event('change', { bubbles: false }));
        } else {
          updateKinkPhrasePreview();
        }
      });
    });
    update();
  });
  updateKinkPhrasePreview();
}
