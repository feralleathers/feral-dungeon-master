import { profileStore } from './profile-store.js';

const TOUR_KEY = 'fdm.inventory.tourDismissed';

let meta = {
  cats: ['All'],
  layers: [],
  anchors: { default: [] },
  hints: {},
  functions: {},
  facets: {}
};

let inventory = [];
let activeCat = 'All';
let anchorFilter = null;
let selectedRowId = null;
let editingId = null;

const dom = {};
const analyticsListeners = [];
const CATEGORY_SECTIONS = {
  default: ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts', 'effects'],
  'Toys (Anal)': ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts', 'effects'],
  'Toys (Oral)': ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts'],
  'Toys (Urethra)': ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'effects'],
  'Toys (Nasal)': ['basics', 'categoryDetails', 'zones', 'safety', 'conflicts'],
  'Toys (Aural)': ['basics', 'categoryDetails', 'zones', 'safety'],
  Outfits: ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts'],
  Restraints: ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts', 'effects'],
  Furniture: ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts'],
  Sensations: ['basics', 'categoryDetails', 'zones', 'supports', 'effects', 'safety'],
  'E-stim': ['basics', 'categoryDetails', 'supports', 'safety', 'effects'],
  Machines: ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts', 'effects']
};
const TAG_OPTIONS = [
  'Smooth',
  'Textured',
  'Soft',
  'Firm',
  'Heavy',
  'Lightweight',
  'Silicone',
  'Latex',
  'Rubber',
  'Leather',
  'Metal',
  'Steel',
  'Neoprene',
  'Spandex'
];
const FORM_FLOW = ['basics', 'categoryDetails', 'zones', 'supports', 'safety', 'conflicts', 'effects'];
const CATEGORY_DETAILS = {
  default: {
    title: 'Category details',
    types: [],
    sizeOptions: [],
    baseOptions: [],
    materialOptions: [],
    fields: { size: false, base: false, material: false, brand: true },
    placeholders: {
      type: 'Describe the item type',
      size: '',
      base: '',
      material: '',
      brand: 'Vendor or maker'
    }
  },
  'Toys (Anal)': {
    title: 'Anal toy details',
    types: ['Butt plug', 'Dildo', 'Probe'],
    sizeOptions: ['Small', 'Medium', 'Large', 'XL', 'XXL', 'Monster'],
    baseOptions: ['Flat base', 'Suction base', 'Vac-u-lock', 'Adapter'],
    materialOptions: ['Silicone', 'Stainless steel', 'Glass', 'TPR'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Choose plug/dildo/probe/etc.',
      size: 'Small — 1.2” tip, 4” insertable',
      base: 'Vac-u-lock, suction, harness ring',
      material: 'Silicone, stainless, glass',
      brand: 'Bad Dragon — Rex'
    }
  },
  'Toys (Oral)': {
    title: 'Gag/oral toy details',
    types: ['Bit gag', 'Ball gag', 'Muzzle'],
    sizeOptions: ['Slim', 'Standard', 'Bulky'],
    baseOptions: ['Strapless', 'Buckle strap', 'Harness', 'Head halter'],
    materialOptions: ['Silicone', 'Rubber', 'Leather', 'Plastic'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Specify gag style',
      size: 'Slim / Standard / Bulky',
      base: 'Strapless, buckle strap, harness',
      material: 'Silicone, rubber, leather',
      brand: 'Oxballs — Cockpit'
    }
  },
  'Toys (Urethra)': {
    title: 'Sound/catheter details',
    types: ['Solid sound', 'Hollow sound', 'Catheter', 'Prince’s wand'],
    sizeOptions: ['Thin', 'Medium', 'Thick'],
    baseOptions: ['Manual hold', 'Self-retaining', 'Chastity mount'],
    materialOptions: ['Steel', 'Silicone', 'Hybrid'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Select sounding style',
      size: 'Thin / Medium / Thick',
      base: 'Self-retaining, chastity mounted',
      material: 'Surgical steel, silicone',
      brand: 'Mr S — Solid Sound'
    }
  },
  'Toys (Nasal)': {
    title: 'Nasal play details',
    types: ['Pig nose hook', 'Breath-play rig', 'Poppers clip'],
    sizeOptions: [],
    baseOptions: ['Hook', 'Mask rig', 'Clip'],
    materialOptions: ['Steel', 'Leather', 'Silicone'],
    fields: { size: false, base: true, material: true, brand: true },
    placeholders: {
      type: 'Select hook/rig type',
      size: '',
      base: 'Hook, rig, clip',
      material: 'Steel, leather, silicone',
      brand: 'e.g., Oxballs'
    }
  },
  'Toys (Aural)': {
    title: 'Ear insert details',
    types: ['Ear plug', 'Canal speaker', 'Headset'],
    sizeOptions: [],
    baseOptions: [],
    materialOptions: ['Foam', 'Silicone', 'Plastic', 'Metal'],
    fields: { size: false, base: false, material: true, brand: true },
    placeholders: {
      type: 'Plug / speaker / headset',
      size: '',
      base: '',
      material: 'Foam, silicone, plastic',
      brand: 'Aftershokz, etc.'
    }
  },
  Outfits: {
    title: 'Outfit details',
    types: ['Latex catsuit', 'ABDL onesie', 'Petsuit', 'Spandex singlet', 'Harness set'],
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    baseOptions: ['Front zip', 'Rear zip', 'Crotch snaps', 'Sheath'],
    materialOptions: ['Latex', 'Neoprene', 'Spandex', 'Leather'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Describe garment family',
      size: 'Selectable size',
      base: 'Front zip, rear zip, crotch snaps',
      material: 'Latex, neoprene, spandex',
      brand: 'Mr S — Alpha suit'
    }
  },
  Restraints: {
    title: 'Restraint details',
    types: ['Cuffs', 'Bitchsuit', 'Segufix straps', 'Kennel', 'Board'],
    sizeOptions: ['Wrist', 'Ankle', 'Full body'],
    baseOptions: ['Bed anchor', 'Furniture mount', 'Free-standing'],
    materialOptions: ['Leather', 'Nylon webbing', 'Steel'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Type of restraint',
      size: 'Fits wrists 6-9", bed strap length',
      base: 'Bed anchor, cross mount, free-standing',
      material: 'Leather, webbing, steel',
      brand: 'Fetters, Serious Bondage, etc.'
    }
  },
  Furniture: {
    title: 'Furniture details',
    types: ['Sex bench', 'Spanking bench', 'Cross', 'Board', 'Sling frame'],
    sizeOptions: ['Compact', 'Standard', 'Oversized'],
    baseOptions: ['Machine mount', 'Restraint hardpoints', 'Standalone'],
    materialOptions: ['Steel', 'Wood', 'Aluminum', 'Upholstered'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Frame style',
      size: 'e.g., 72" L × 24" W',
      base: 'Machine mount, restraint hardpoints',
      material: 'Steel, wood, padded vinyl',
      brand: 'DungeonDelights bench'
    }
  },
  Sensations: {
    title: 'Sensation tool details',
    types: ['Feather tickler', 'Pinwheel', 'Wartenberg glove', 'Paddle'],
    sizeOptions: [],
    baseOptions: [],
    materialOptions: ['Feather', 'Leather', 'Silicone', 'Metal'],
    fields: { size: false, base: false, material: true, brand: true },
    placeholders: {
      type: 'Describe sensation type',
      size: '',
      base: '',
      material: 'Goose feather, silicone whip',
      brand: 'KinkLab, etc.'
    }
  },
  'E-stim': {
    title: 'E-stim details',
    types: ['Butt plug electrode', 'Chastity pad', 'Crusher plates', 'Adhesive pad'],
    sizeOptions: ['Small', 'Medium', 'Large'],
    baseOptions: ['Snap', 'Pin', '3.5mm plug', 'Adapter'],
    materialOptions: ['Silicone', 'Aluminum', 'Conductive rubber'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Choose electrode style',
      size: 'Medium plug, 30mm diameter',
      base: '4mm snap, 3.5mm plug, insert rod',
      material: 'Silicone, aluminum, conductive rubber',
      brand: 'ErosTek, ElectraStim, etc.'
    }
  },
  Machines: {
    title: 'Machine details',
    types: ['Thrusting machine', 'Adapter arm', 'Restraint robot'],
    sizeOptions: ['Portable', 'Bench', 'Industrial'],
    baseOptions: ['Vac-u-lock', 'Adapter arm', 'Bench rail'],
    materialOptions: ['Steel frame', 'Aluminum', 'Composite'],
    fields: { size: true, base: true, material: true, brand: true },
    placeholders: {
      type: 'Device style',
      size: 'Stroke 6”, 40–200 thrusts/min',
      base: 'Vac-u-lock mount, bench rail',
      material: 'Steel frame, silicone attachment',
      brand: 'SeriousToyz, Motorbunny, etc.'
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  init().catch(handleFatal);
});

async function init() {
  cacheDom();
  profileStore.init();
  meta = await fetchMeta();
  activeCat = meta.cats.includes('All') ? 'All' : meta.cats[0] || 'All';
  hydrateSelectors();
  setupProfileFields();
  loadInventoryFromStorage();
  resetForm();
  renderAll();
  wireUi();
  exposeApi();
  track('inventory:init', { count: inventory.length });
  if (!safeLocalStorage('get', TOUR_KEY)) {
    setTimeout(() => startTour(true), 800);
  }
}

function cacheDom() {
  dom.wrap = document.querySelector('.wrap');
  dom.catList = document.getElementById('cats');
  dom.drop = document.getElementById('drop');
  dom.file = document.getElementById('file');
  dom.q = document.getElementById('q');
  dom.selCat = document.getElementById('selCat');
  dom.statsCount = document.getElementById('statsCount');
  dom.anchorChips = document.getElementById('anchorChips');
  dom.functionChips = document.getElementById('functionChips');
  dom.facetChips = document.getElementById('facetChips');
  dom.catHint = document.getElementById('catHint');
  dom.tbl = document.getElementById('tbl');
  dom.cards = document.getElementById('cards');
  dom.tourBtn = document.getElementById('tourBtn');
  dom.profName = document.getElementById('profName');
  dom.saveProf = document.getElementById('saveProf');
  dom.loadDemo = document.getElementById('loadDemo');
  dom.expCSV = document.getElementById('expCSV');
  dom.expJSON = document.getElementById('expJSON');
  dom.analysisPanel = document.getElementById('analysisPanel');
  dom.inspector = document.getElementById('inspector');
  dom.inspToggle = document.getElementById('inspToggle');
  dom.inspName = document.getElementById('inspName');
  dom.inspCat = document.getElementById('inspCat');
  dom.inspLayer = document.getElementById('inspLayer');
  dom.inspSafetyScore = document.getElementById('inspSafetyScore');
  dom.inspZones = document.getElementById('inspZones');
  dom.inspAnchors = document.getElementById('inspAnchors');
  dom.inspTags = document.getElementById('inspTags');
  dom.inspSafety = document.getElementById('inspSafety');
  dom.inspConflicts = document.getElementById('inspConflicts');
  dom.inspSupports = document.getElementById('inspSupports');
  dom.inspEffects = document.getElementById('inspEffects');
  dom.formPanel = document.getElementById('formPanel');
  dom.sectionNodes = Array.from(document.querySelectorAll('#formPanel [data-section]'));
  dom.sectionMap = {};
  dom.sectionNodes.forEach((node) => {
    if (node.dataset.section) dom.sectionMap[node.dataset.section] = node;
  });
  dom.mtitle = document.getElementById('mtitle');
  dom.mclose = document.getElementById('mclose');
  dom.mname = document.getElementById('mname');
  dom.mcat = document.getElementById('mcat');
  dom.mlayer = document.getElementById('mlayer');
  dom.mtags = document.getElementById('mtags');
  dom.tagChips = document.getElementById('tagChips');
  dom.mzones = document.getElementById('mzones');
  dom.zoneHint = document.getElementById('zoneHint');
  dom.manchors = document.getElementById('manchors');
  dom.msupports = document.getElementById('msupports');
  dom.msafetyNotes = document.getElementById('msafe');
  dom.msafetyScore = document.getElementById('msafetyScore');
  dom.accChecks = Array.from(document.querySelectorAll('.acc'));
  dom.mconflicts = document.getElementById('mconflicts');
  dom.meffects = document.getElementById('meffects');
  dom.msave = document.getElementById('msave');
  dom.mcancel = document.getElementById('mcancel');
  dom.extraTitle = document.getElementById('extraTitle');
  dom.typeLabel = document.getElementById('typeLabel');
  dom.typeChips = document.getElementById('typeChips');
  dom.typeInputWrap = document.getElementById('typeInputWrap');
  dom.mType = document.getElementById('mType');
  dom.extraCatChips = document.getElementById('extraCatChips');
  dom.mExtraCats = document.getElementById('mExtraCats');
  dom.sizeField = document.getElementById('sizeField');
  dom.sizeLabel = document.getElementById('sizeLabel');
  dom.sizeChips = document.getElementById('sizeChips');
  dom.sizeInputWrap = document.getElementById('sizeInputWrap');
  dom.mSize = document.getElementById('mSize');
  dom.baseField = document.getElementById('baseField');
  dom.baseLabel = document.getElementById('baseLabel');
  dom.baseChips = document.getElementById('baseChips');
  dom.baseInputWrap = document.getElementById('baseInputWrap');
  dom.mBase = document.getElementById('mBase');
  dom.materialField = document.getElementById('materialField');
  dom.materialLabel = document.getElementById('materialLabel');
  dom.materialChips = document.getElementById('materialChips');
  dom.materialInputWrap = document.getElementById('materialInputWrap');
  dom.mMaterial = document.getElementById('mMaterial');
  dom.brandField = document.getElementById('brandField');
  dom.brandLabel = document.getElementById('brandLabel');
  dom.brandInputWrap = document.getElementById('brandInputWrap');
  dom.mBrand = document.getElementById('mBrand');
  dom.inspSpecs = document.getElementById('inspSpecs');
}

async function fetchMeta() {
  const res = await fetch('meta/categories.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Unable to load inventory metadata');
  const data = await res.json();
  const cats = Array.isArray(data.cats) ? data.cats.slice() : [];
  if (!cats.includes('All')) cats.push('All');
  return {
    cats,
    layers: Array.isArray(data.layers) ? data.layers : [],
    anchors: data.anchors || { default: [] },
    hints: data.hints || {},
    functions: data.functions || {},
    facets: data.facets || {},
    metaVersion: data.version || 'fdm.inventory.meta.v1'
  };
}

function hydrateSelectors() {
  if (dom.mcat) {
    const catOptions = meta.cats
      .filter((cat) => cat !== 'All')
      .map((cat) => `<option value="${escAttr(cat)}">${esc(cat)}</option>`)
      .join('');
    dom.mcat.innerHTML = catOptions;
    const defaultCat = meta.cats.find((cat) => cat !== 'All') || meta.cats[0] || 'All';
    dom.mcat.value = defaultCat;
    applySectionVisibility(defaultCat);
    applyCategoryDetails(defaultCat);
    renderExtraCatChips();
  }
  if (dom.mlayer) {
    dom.mlayer.innerHTML = meta.layers
      .map((layer) => `<option value="${escAttr(layer)}">${esc(layer)}</option>`)
      .join('');
  }
  if (dom.selCat) {
    dom.selCat.innerHTML = meta.cats
      .map((cat) => `<option value="${escAttr(cat)}">${esc(cat)}</option>`)
      .join('');
    dom.selCat.value = activeCat;
  }
  renderTagChips();
  refreshSectionFlow();
}

function setupProfileFields() {
  if (dom.profName) {
    dom.profName.value = profileStore.getProfileName();
  }
  dom.saveProf?.addEventListener('click', () => {
    profileStore.setProfileName(dom.profName?.value.trim() || '');
    toast('Profile name saved.');
  });
  dom.loadDemo?.addEventListener('click', () => {
    if (!confirm('Replace the current catalog with the demo loadout?')) return;
    inventory = DEMO_ITEMS.map(normaliseItem).filter(Boolean);
    selectedRowId = null;
    renderAfterDataChange();
    track('inventory:demo', { count: inventory.length });
  });
  dom.expCSV?.addEventListener('click', exportCSV);
  dom.expJSON?.addEventListener('click', exportJSON);
  dom.mtags?.addEventListener('input', renderTagChips);
  dom.mcat?.addEventListener('change', renderExtraCatChips);
  dom.mname?.addEventListener('input', refreshSectionFlow);
  dom.mType?.addEventListener('input', refreshSectionFlow);
  const syncProfileName = () => {
    if (dom.profName) dom.profName.value = profileStore.getProfileName();
  };
  profileStore.on('profile:switched', syncProfileName);
  profileStore.on('profile:imported', syncProfileName);
  profileStore.on('profile:updated', (detail) => {
    if (!detail?.fields || detail.fields.includes('profileName')) syncProfileName();
  });
}

function loadInventoryFromStorage() {
  const stored = profileStore.getInventoryItems();
  const items = stored.length ? stored : DEMO_ITEMS;
  inventory = items.map(normaliseItem).filter(Boolean);
  if (!stored.length) profileStore.replaceInventoryItems(inventory, meta.metaVersion);
  sortInventory();
}

function renderAll() {
  renderCats();
  renderCatHint();
  renderFunctionChips();
  renderFacetChips();
  renderAnchorFilters();
  renderTable();
}

function wireUi() {
  dom.q?.addEventListener('input', renderTable);
  dom.selCat?.addEventListener('change', () => {
    activeCat = dom.selCat.value;
    anchorFilter = null;
    renderCats();
    renderCatHint();
    renderFunctionChips();
    renderFacetChips();
    renderAnchorFilters();
    renderTable();
  });
  dom.mclose?.addEventListener('click', closeModal);
  dom.mcancel?.addEventListener('click', closeModal);
  dom.mcat?.addEventListener('change', () => {
    updateModalHint(dom.mcat.value);
    buildAnchorCheckboxes(dom.mcat.value, getSelectedAnchors());
    applySectionVisibility(dom.mcat.value);
    applyCategoryDetails(dom.mcat.value);
  });
  dom.msave?.addEventListener('click', handleModalSave);
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
  });
  dom.tourBtn?.addEventListener('click', () => startTour(false));
  dom.inspToggle?.addEventListener('click', () => {
    if (!dom.inspector) return;
    dom.inspector.classList.toggle('collapsed');
    dom.inspToggle.textContent = dom.inspector.classList.contains('collapsed') ? 'Expand' : 'Collapse';
  });
  setupDropzone();
}

function openModal(item) {
  if (!dom.formPanel) return;
  editingId = item?.id || null;
  const defaultCat = item?.cat || (activeCat !== 'All' ? activeCat : dom.mcat.value);
  dom.formPanel.dataset.mode = editingId ? 'edit' : 'create';
  dom.mtitle.textContent = editingId ? 'Edit item' : 'Add item';
  dom.mname.value = item?.name || '';
  dom.mcat.value = meta.cats.includes(defaultCat) ? defaultCat : meta.cats.find((c) => c !== 'All') || 'All';
  dom.mlayer.value = meta.layers.includes(item?.layer) ? item.layer : meta.layers[0] || '';
  dom.mtags.value = (item?.tags || []).join(', ');
  dom.mzones.value = (item?.zones || []).join(', ');
  dom.msupports.value = supportsToText(item?.supports || {});
  dom.msafetyNotes.value = item?.safetyNotes || '';
  dom.msafetyScore.value =
    typeof item?.safetyScore === 'number' ? item.safetyScore : (Number.isFinite(Number(item?.safetyScore)) ? clamp(Number(item.safetyScore), 0, 5) : 3);
  dom.mconflicts.value = item?.conflicts || '';
  dom.meffects.value = (item?.effects || []).join('\n');
  dom.mType.value = item?.typeDetail || item?.type || '';
  dom.mSize.value = item?.sizeSpec || '';
  dom.mBase.value = item?.baseAttachment || '';
  dom.mMaterial.value = item?.material || '';
  dom.mBrand.value = item?.brand || '';
  dom.mExtraCats.value = (item?.extraCats || []).join(', ');
  updateModalHint(dom.mcat.value);
  buildAnchorCheckboxes(dom.mcat.value, item?.anchors || []);
  setAccessChecks(item?.access || []);
  applySectionVisibility(dom.mcat.value);
  applyCategoryDetails(dom.mcat.value);
  renderExtraCatChips();
  renderTagChips();
  setTimeout(() => dom.mname?.focus(), 40);
}

function resetForm() {
  if (!dom.mcat) return;
  const defaultCat = meta.cats.find((cat) => cat !== 'All') || meta.cats[0] || 'All';
  dom.mtitle.textContent = 'Add Item';
  dom.mname.value = '';
  dom.mcat.value = defaultCat;
  dom.mlayer.value = meta.layers[0] || '';
  dom.mtags.value = '';
  dom.mzones.value = '';
  dom.msupports.value = '';
  dom.msafetyNotes.value = '';
  dom.msafetyScore.value = 3;
  dom.mconflicts.value = '';
  dom.meffects.value = '';
  dom.mType.value = '';
  dom.mSize.value = '';
  dom.mBase.value = '';
  dom.mMaterial.value = '';
  dom.mBrand.value = '';
  dom.mExtraCats.value = '';
  setAccessChecks([]);
  buildAnchorCheckboxes(dom.mcat.value, []);
  updateModalHint(dom.mcat.value);
  applySectionVisibility(dom.mcat.value);
  applyCategoryDetails(dom.mcat.value);
  renderExtraCatChips();
  renderTagChips();
  if (dom.formPanel) dom.formPanel.dataset.mode = 'create';
}

function closeModal() {
  resetForm();
  if (dom.formPanel?.dataset) delete dom.formPanel.dataset.mode;
  editingId = null;
  refreshSectionFlow();
}

function handleModalSave() {
  if (!dom.mname.value.trim()) {
    dom.mname.focus();
    return;
  }
  const payload = normaliseItem({
    id: editingId || makeId(),
    name: dom.mname.value.trim(),
    cat: dom.mcat.value,
    layer: dom.mlayer.value,
    tags: splitList(dom.mtags.value),
    zones: splitList(dom.mzones.value),
    anchors: getSelectedAnchors(),
    supports: parseSupports(dom.msupports.value),
    safetyNotes: dom.msafetyNotes.value.trim(),
    safetyScore: dom.msafetyScore.value,
    access: getAccessChecks(),
    conflicts: dom.mconflicts.value.trim(),
    effects: splitLines(dom.meffects.value),
    typeDetail: dom.mType.value.trim(),
    sizeSpec: dom.mSize.value.trim(),
    baseAttachment: dom.mBase.value.trim(),
    material: dom.mMaterial.value.trim(),
    brand: dom.mBrand.value.trim(),
    extraCats: splitList(dom.mExtraCats.value)
  });
  const idx = inventory.findIndex((item) => item.id === payload.id);
  if (idx > -1) {
    inventory.splice(idx, 1, payload);
    track('inventory:update', { id: payload.id });
  } else {
    inventory.push(payload);
    track('inventory:add', { id: payload.id });
  }
  selectedRowId = payload.id;
  closeModal();
  renderAfterDataChange();
}

function renderAfterDataChange() {
  sortInventory();
  persistInventory();
  renderCats();
  renderCatHint();
  renderFunctionChips();
  renderFacetChips();
  renderAnchorFilters();
  renderTable();
}

function buildAnchorCheckboxes(cat, selected = []) {
  if (!dom.manchors) return;
  const base = anchorOptions(cat);
  const extras = selected.filter((anchor) => !base.includes(anchor));
  dom.manchors.innerHTML = [...base, ...extras]
    .map(
      (anchor) =>
        `<label><input type="checkbox" value="${escAttr(anchor)}"${selected.includes(anchor) ? ' checked' : ''}><span>${esc(anchor)}</span></label>`
    )
    .join('');
}

function updateModalHint(cat) {
  if (!dom.zoneHint) return;
  const hint = meta.hints?.[cat];
  if (!hint) {
    dom.zoneHint.classList.add('hidden');
    dom.zoneHint.textContent = '';
    return;
  }
  dom.zoneHint.classList.remove('hidden');
  dom.zoneHint.textContent = `${hint.label} — ${hint.note} | Zones: ${hint.zones.join(', ')}`;
}

function applySectionVisibility(cat) {
  if (!dom.sectionMap) return;
  const allowed = CATEGORY_SECTIONS[cat] || CATEGORY_SECTIONS.default;
  Object.entries(dom.sectionMap).forEach(([key, node]) => {
    node.classList.toggle('hidden', allowed && !allowed.includes(key));
  });
}

function applyCategoryDetails(cat) {
  if (!dom.mType) return;
  const cfg = CATEGORY_DETAILS[cat] || CATEGORY_DETAILS.default;
  dom.extraTitle && (dom.extraTitle.textContent = cfg.title || 'Category details');
  dom.typeLabel && (dom.typeLabel.textContent = cfg.types?.length ? 'Suggested item types' : 'Item type');
  renderChipGroup({
    container: dom.typeChips,
    options: cfg.types,
    inputWrap: dom.typeInputWrap,
    inputEl: dom.mType,
    placeholder: cfg.placeholders?.type || 'Describe the item type'
  });
  showElement(dom.sizeField, cfg.fields.size);
  if (cfg.fields.size) {
    dom.sizeLabel && (dom.sizeLabel.textContent = 'Size');
    renderChipGroup({
      container: dom.sizeChips,
      options: cfg.sizeOptions,
      inputWrap: dom.sizeInputWrap,
      inputEl: dom.mSize,
      placeholder: cfg.placeholders?.size || 'Describe size'
    });
  } else if (dom.mSize) {
    dom.mSize.value = '';
    dom.sizeInputWrap?.classList.add('hidden');
    dom.sizeChips && (dom.sizeChips.innerHTML = '<span class="small">Not required for this category.</span>');
  }
  showElement(dom.baseField, cfg.fields.base);
  if (cfg.fields.base) {
    dom.baseLabel && (dom.baseLabel.textContent = cfg.baseOptions?.length ? 'Attachment base' : 'Attachment details');
    renderChipGroup({
      container: dom.baseChips,
      options: cfg.baseOptions,
      inputWrap: dom.baseInputWrap,
      inputEl: dom.mBase,
      placeholder: cfg.placeholders?.base || 'Describe attachment base'
    });
  } else if (dom.mBase) {
    dom.mBase.value = '';
    dom.baseInputWrap?.classList.add('hidden');
    dom.baseChips && (dom.baseChips.innerHTML = '<span class="small">Not required for this category.</span>');
  }
  showElement(dom.materialField, cfg.fields.material);
  if (cfg.fields.material) {
    dom.materialLabel && (dom.materialLabel.textContent = 'Material');
    renderChipGroup({
      container: dom.materialChips,
      options: cfg.materialOptions,
      inputWrap: dom.materialInputWrap,
      inputEl: dom.mMaterial,
      placeholder: cfg.placeholders?.material || 'Describe material'
    });
  } else if (dom.mMaterial) {
    dom.mMaterial.value = '';
    dom.materialInputWrap?.classList.add('hidden');
    dom.materialChips && (dom.materialChips.innerHTML = '<span class="small">Not required for this category.</span>');
  }
  showElement(dom.brandField, cfg.fields.brand !== false);
  if (dom.brandLabel) dom.brandLabel.textContent = 'Store / Brand (optional)';
  if (dom.mBrand) dom.mBrand.placeholder = cfg.placeholders?.brand || 'Store or maker';
  refreshSectionFlow();
}

function showElement(el, show) {
  if (!el) return;
  el.style.display = show ? '' : 'none';
}

function renderChipGroup({ container, options, inputWrap, inputEl, placeholder }) {
  if (!container || !inputEl) return;
  inputEl.placeholder = placeholder || '';
  const list = Array.isArray(options) ? options.filter(Boolean) : [];
  if (!list.length) {
    container.innerHTML = '<span class="small">Describe below.</span>';
    inputWrap?.classList.remove('hidden');
    return;
  }
  const values = list.includes('Other') ? [...list] : [...list, 'Other'];
  container.innerHTML = values
    .map((label) => `<button type="button" class="chip" data-value="${escAttr(label)}">${esc(label)}</button>`)
    .join('');
  const buttons = container.querySelectorAll('button');
  const setActive = (val, manual) => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn.dataset.value === val));
    if (manual) {
      inputWrap?.classList.remove('hidden');
      inputEl.focus();
    } else {
      inputWrap?.classList.add('hidden');
    }
  };
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      if (val === 'Other') {
        if (!inputEl.value || values.includes(inputEl.value)) inputEl.value = '';
        setActive(val, true);
      } else {
        inputEl.value = val;
        setActive(val, false);
      }
    });
  });
  const current = inputEl.value?.trim();
  if (current) {
    const matched = values.find((opt) => opt !== 'Other' && opt.toLowerCase() === current.toLowerCase());
    if (matched) {
      setActive(matched, false);
    } else {
      setActive('Other', true);
    }
  } else {
    buttons.forEach((btn) => btn.classList.remove('active'));
    inputWrap?.classList.add('hidden');
  }
  refreshSectionFlow();
}

function setAccessChecks(access) {
  dom.accChecks?.forEach((cb) => {
    cb.checked = access.includes(cb.value);
  });
}

function getAccessChecks() {
  return dom.accChecks ? dom.accChecks.filter((cb) => cb.checked).map((cb) => cb.value) : [];
}

function getSelectedAnchors() {
  return dom.manchors ? Array.from(dom.manchors.querySelectorAll('input[type=checkbox]:checked')).map((cb) => cb.value) : [];
}

function renderTagChips() {
  if (!dom.tagChips || !dom.mtags) return;
  const current = new Set(splitList(dom.mtags.value));
  dom.tagChips.innerHTML = TAG_OPTIONS.map((tag) => {
    const active = current.has(tag);
    return `<button type="button" class="chip${active ? ' active' : ''}" data-tag="${escAttr(tag)}">${esc(tag)}</button>`;
  }).join('');
  dom.tagChips.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.tag;
      if (current.has(val)) current.delete(val);
      else current.add(val);
      dom.mtags.value = Array.from(current).join(', ');
      renderTagChips();
    });
  });
}

function renderExtraCatChips() {
  if (!dom.extraCatChips || !dom.mExtraCats || !dom.mcat) return;
  const options = meta.cats.filter((cat) => cat !== 'All' && cat !== dom.mcat.value);
  let selected = splitList(dom.mExtraCats.value).filter((cat) => options.includes(cat));
  dom.mExtraCats.value = selected.join(', ');
  if (!options.length) {
    dom.extraCatChips.innerHTML = '<span class="small">No additional categories.</span>';
    return;
  }
  dom.extraCatChips.innerHTML = options
    .map(
      (cat) =>
        `<button type="button" class="chip${selected.includes(cat) ? ' active' : ''}" data-cat="${escAttr(cat)}">${esc(cat)}</button>`
    )
    .join('');
  dom.extraCatChips.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.cat;
      if (selected.includes(val)) selected = selected.filter((c) => c !== val);
      else selected.push(val);
      dom.mExtraCats.value = selected.join(', ');
      renderExtraCatChips();
    });
  });
  refreshSectionFlow();
}

function basicsComplete() {
  return !!dom.mname?.value.trim();
}

function detailsComplete() {
  return !!dom.mType?.value.trim();
}

function refreshSectionFlow() {
  if (!dom.sectionMap) return;
  FORM_FLOW.forEach((key) => {
    const node = dom.sectionMap[key];
    if (!node) return;
    if (key === 'basics') {
      node.classList.remove('collapsed');
      return;
    }
    if (key === 'categoryDetails') {
      node.classList.toggle('collapsed', !basicsComplete());
      return;
    }
    node.classList.toggle('collapsed', !detailsComplete());
  });
}

function renderCats() {
  if (!dom.catList) return;
  dom.catList.innerHTML = '';
  meta.cats.forEach((cat) => {
    const count =
      cat === 'All'
        ? inventory.length
        : inventory.filter((item) => item.cat === cat || (item.extraCats || []).includes(cat)).length;
    const node = document.createElement('div');
    node.className = 'cat' + (cat === activeCat ? ' active' : '');
    node.innerHTML = `<span>${esc(cat)}</span><span class="small">${count}</span>`;
    node.addEventListener('click', () => {
      activeCat = cat;
      anchorFilter = null;
      if (dom.selCat) dom.selCat.value = cat;
      renderCats();
      renderCatHint();
      renderFunctionChips();
      renderFacetChips();
      renderAnchorFilters();
      renderTable();
      if (cat !== 'All' && dom.mcat && dom.mcat.value !== cat) {
        dom.mcat.value = cat;
        updateModalHint(cat);
        buildAnchorCheckboxes(cat, []);
        applySectionVisibility(cat);
        applyCategoryDetails(cat);
      }
    });
    dom.catList.appendChild(node);
  });
}

function renderCatHint() {
  if (!dom.catHint) return;
  const hint = meta.hints?.[activeCat];
  if (!hint) {
    dom.catHint.classList.add('hidden');
    dom.catHint.innerHTML = '';
    return;
  }
  dom.catHint.classList.remove('hidden');
  dom.catHint.innerHTML = `<strong>${esc(hint.label)}</strong><br>${esc(hint.note)}<br><span class="small">Zones: ${hint.zones.join(', ')}</span>`;
}

function renderFunctionChips() {
  if (!dom.functionChips) return;
  const funcs = meta.functions?.[activeCat] || [];
  dom.functionChips.innerHTML = funcs.length
    ? funcs.map((label) => `<span class="chip passive">${esc(label)}</span>`).join('')
    : '<span class="small">No specific functions</span>';
}

function renderFacetChips() {
  if (!dom.facetChips) return;
  const facets = meta.facets?.[activeCat] || [];
  if (!facets.length) {
    dom.facetChips.innerHTML = '<span class="small">No additional facets</span>';
    return;
  }
  dom.facetChips.innerHTML = facets
    .map(
      (facet) =>
        `<div class="facetblock"><span class="facetlabel">${esc(facet.label)}:</span>${(facet.options || [])
          .map((opt) => `<span class="chip passive">${esc(opt)}</span>`)
          .join('')}</div>`
    )
    .join('');
}

function renderAnchorFilters() {
  if (!dom.anchorChips) return;
  const chipRow = dom.anchorChips;
  chipRow.innerHTML = '';
  const catAnchors = anchorOptions(activeCat);
  const extras = new Set();
  inventory
    .filter((item) => activeCat === 'All' || item.cat === activeCat)
    .forEach((item) => {
      (item.anchors || []).forEach((anchor) => {
        if (!catAnchors.includes(anchor)) extras.add(anchor);
      });
    });
  const options = [{ label: 'All anchors', value: null }]
    .concat(catAnchors.map((anchor) => ({ label: anchor, value: anchor })))
    .concat(Array.from(extras).map((anchor) => ({ label: anchor, value: anchor })));
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + ((anchorFilter === opt.value) || (!anchorFilter && opt.value === null) ? ' active' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      anchorFilter = opt.value;
      renderAnchorFilters();
      renderTable();
    });
    chipRow.appendChild(btn);
  });
}

function anchorOptions(cat) {
  if (cat && meta.anchors?.[cat]) return meta.anchors[cat];
  return meta.anchors?.default || [];
}

function renderTable() {
  if (!dom.cards) return;
  const q = dom.q?.value.trim().toLowerCase() || '';
  const filtered = inventory.filter((item) => {
    const catMatch =
      activeCat === 'All' || item.cat === activeCat || (item.extraCats || []).includes(activeCat);
    const anchorMatch = !anchorFilter || (item.anchors || []).includes(anchorFilter);
    const haystack = `${item.name} ${(item.tags || []).join(' ')}`.toLowerCase();
    const searchMatch = !q || haystack.includes(q);
    return catMatch && anchorMatch && searchMatch;
  });
  dom.cards.innerHTML = '';
  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'invcard';
    card.dataset.id = item.id;
    if (item.id === selectedRowId) card.classList.add('selected');
    const extra = (item.extraCats || [])
      .map((cat) => `<span class="pill secondary">${esc(cat)}</span>`)
      .join('');
    card.innerHTML = `
      <div class="invcard-header">
        <div class="invcard-main">
          <h4>${esc(item.name)}</h4>
          <span class="pill">${esc(item.cat)}</span>
          ${extra}
          ${item.sizeSpec ? `<span class="pill">${esc(item.sizeSpec)}</span>` : ''}
        </div>
        <button type="button" class="btn" data-toggle>Details</button>
      </div>
      <div class="invcard-body">
        <div class="small">Zones: ${listHTML(item.zones)}</div>
        <div class="small">Anchors: ${listHTML(item.anchors)}</div>
        <div class="small">Safety: ${scoreStr(item)}</div>
        <div class="cardactions">
          <button class="btn" data-ed>Edit</button>
          <button class="btn" data-dup>Duplicate</button>
          <button class="btn" data-del>Delete</button>
        </div>
      </div>`;
    card.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-ed]') || ev.target.closest('[data-dup]') || ev.target.closest('[data-del]')) return;
      if (ev.target.closest('[data-toggle]')) {
        card.classList.toggle('expanded');
        return;
      }
      selectRow(item.id);
    });
    card.querySelector('[data-ed]')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      openModal(item);
    });
    card.querySelector('[data-dup]')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      dupItem(item.id);
    });
    card.querySelector('[data-del]')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      deleteItem(item.id);
    });
    dom.cards.appendChild(card);
  });
  if (selectedRowId && !filtered.some((item) => item.id === selectedRowId)) {
    selectedRowId = null;
    renderInspector(null);
  }
  if (!selectedRowId && filtered.length) {
    selectRow(filtered[0].id);
  }
  renderStats(filtered.length);
}

function renderStats(count) {
  if (dom.statsCount) dom.statsCount.textContent = `Items: ${count} / ${inventory.length}`;
}

function selectRow(id) {
  selectedRowId = id;
  dom.cards?.querySelectorAll('.invcard').forEach((card) => {
    card.classList.toggle('selected', card.dataset.id === id);
  });
  renderInspector(inventory.find((item) => item.id === id) || null);
}

function renderInspector(item) {
  if (!dom.inspector) return;
  if (!item) {
    dom.analysisPanel?.classList.add('hidden');
    return;
  }
  dom.analysisPanel?.classList.remove('hidden');
  dom.inspToggle && (dom.inspToggle.textContent = dom.inspector.classList.contains('collapsed') ? 'Expand' : 'Collapse');
  dom.inspName.textContent = item.name;
  const extraCats = item.extraCats?.length ? ` + ${item.extraCats.join(', ')}` : '';
  dom.inspCat.textContent = `${item.cat}${extraCats}`;
  dom.inspLayer.textContent = item.layer ? `Layer: ${item.layer}` : 'Layer: —';
  dom.inspSafetyScore.textContent =
    typeof item.safetyScore === 'number'
      ? `Safety: ${item.safetyScore}/5 (5 safest)`
      : 'Safety: —';
  dom.inspZones.innerHTML = listHTML(item.zones);
  if (dom.inspSpecs) dom.inspSpecs.innerHTML = specsHTML(item);
  dom.inspAnchors.innerHTML = listHTML(item.anchors);
  dom.inspTags.innerHTML = listHTML(item.tags);
  dom.inspSafety.textContent = item.safetyNotes || '—';
  dom.inspConflicts.textContent = item.conflicts || '—';
  dom.inspSupports.innerHTML = supportsToBlocks(item.supports);
  dom.inspEffects.innerHTML = listHTML(item.effects);
}

function listHTML(list) {
  const arr = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!arr.length) return '<span class="small" style="opacity:.6">—</span>';
  return arr.map((value) => `<span class="pill">${esc(value)}</span>`).join('');
}

function specsHTML(item) {
  const bits = [];
  if (item.typeDetail) bits.push(`<span class="pill">${esc(item.typeDetail)}</span>`);
  if (item.sizeSpec) bits.push(`<span class="pill">Size: ${esc(item.sizeSpec)}</span>`);
  if (item.baseAttachment) bits.push(`<span class="pill">Base: ${esc(item.baseAttachment)}</span>`);
  if (item.material) bits.push(`<span class="pill">Material: ${esc(item.material)}</span>`);
  if (item.brand) bits.push(`<span class="pill">Brand: ${esc(item.brand)}</span>`);
  if (!bits.length) return '<span class="small" style="opacity:.6">—</span>';
  return bits.join(' ');
}

function supportsToBlocks(supports) {
  const entries = Object.entries(supports || {});
  if (!entries.length) return '<span class="small" style="opacity:.6">—</span>';
  return entries
    .map(([anchor, uses]) => `<div><strong>${esc(anchor)}:</strong> ${esc(Array.isArray(uses) ? uses.join('; ') : uses)}</div>`)
    .join('');
}

function scoreStr(item) {
  const score =
    typeof item.safetyScore === 'number'
      ? `${item.safetyScore}/5 <span class="small">(5 safest)</span>`
      : '—';
  const access = (item.access || []).length
    ? `<div class="small">${item.access.map((entry) => esc(entry)).join(', ')}</div>`
    : '';
  return `<div>${score}</div>${access}`;
}

function dupItem(id) {
  const src = inventory.find((item) => item.id === id);
  if (!src) return;
  const copy = normaliseItem({ ...src, id: makeId(), name: `${src.name} (copy)` });
  inventory.push(copy);
  selectedRowId = copy.id;
  track('inventory:duplicate', { source: id, id: copy.id });
  renderAfterDataChange();
}

function deleteItem(id) {
  const idx = inventory.findIndex((item) => item.id === id);
  if (idx === -1) return;
  if (!confirm('Delete this item?')) return;
  inventory.splice(idx, 1);
  if (selectedRowId === id) selectedRowId = null;
  track('inventory:delete', { id });
  renderAfterDataChange();
}

function exportCSV() {
  const csv = toCSV(inventory);
  download('fdm-inventory.csv', csv, 'text/csv');
  track('inventory:export', { format: 'csv', count: inventory.length });
}

function exportJSON() {
  const profile = profileStore.exportActiveProfile();
  const payload = JSON.stringify(profile || { items: inventory }, null, 2);
  download('fdm-profile.json', payload, 'application/json');
  track('inventory:export', { format: 'profile-json', count: inventory.length });
}

function setupDropzone() {
  if (!dom.drop) return;
  const stop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  ['dragenter', 'dragover'].forEach((evt) =>
    dom.drop.addEventListener(evt, (ev) => {
      stop(ev);
      dom.drop.classList.add('over');
    })
  );
  ['dragleave', 'drop'].forEach((evt) =>
    dom.drop.addEventListener(evt, (ev) => {
      stop(ev);
      if (evt === 'drop') return;
      dom.drop.classList.remove('over');
    })
  );
  dom.drop.addEventListener('drop', (ev) => {
    dom.drop.classList.remove('over');
    const file = ev.dataTransfer?.files?.[0];
    if (file) readFile(file);
  });
  dom.file?.addEventListener('change', (ev) => {
    const file = ev.target.files?.[0];
    if (file) readFile(file);
    ev.target.value = '';
  });
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    handleFileText(evt.target.result, file.name);
  };
  reader.readAsText(file);
}

function handleFileText(text, filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  const trimmed = text.trim();
  try {
    if (ext === 'json' || trimmed.startsWith('{') || trimmed.startsWith('[')) {
      importFromJson(trimmed);
    } else {
      importFromCsv(text);
    }
  } catch (err) {
    alert('Unable to import file. See console for details.');
    console.error(err);
  }
}

function importFromJson(text) {
  const data = JSON.parse(text);
  if (data && typeof data === 'object' && data.version >= 2 && data.inventory) {
    const prof = profileStore.importProfile(data, { activate: true });
    dom.profName && (dom.profName.value = prof.profileName || '');
    inventory = (Array.isArray(prof.inventory?.items) ? prof.inventory.items : [])
      .map(normaliseItem)
      .filter(Boolean);
    selectedRowId = null;
    renderAfterDataChange();
    toast('Profile imported.');
    return;
  }
  let items = [];
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data.items)) items = data.items;
  else if (data.inventory && Array.isArray(data.inventory.items)) items = data.inventory.items;
  else if (Array.isArray(data.data)) items = data.data;
  applyImportedItems(items.map(normaliseItem).filter(Boolean));
}

function importFromCsv(text) {
  const rows = parseCsv(text);
  const items = rows
    .map((row) =>
      normaliseItem({
        id: row.id,
        name: row.name,
        cat: row.cat,
        extraCats: row.extraCats,
        layer: row.layer,
        zones: row.zones,
        anchors: row.anchors,
        tags: row.tags,
        access: row.access,
        safetyScore: row.safetyScore || row.safety,
        safetyNotes: row.safetyNotes || row.safety,
        supports: row.supports,
        conflicts: row.conflicts,
        effects: row.effects,
        typeDetail: row.typeDetail || row.type,
        sizeSpec: row.sizeSpec || row.size,
        baseAttachment: row.baseAttachment || row.base,
        material: row.material,
        brand: row.brand
      })
    )
    .filter(Boolean);
  applyImportedItems(items);
}

function applyImportedItems(items) {
  if (!items.length) {
    toast('No valid items found in the uploaded file.');
    return;
  }
  if (!confirm(`Replace the current ${inventory.length} items with ${items.length} imported items?`)) return;
  inventory = items;
  selectedRowId = null;
  track('inventory:import', { count: items.length });
  renderAfterDataChange();
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines.shift());
  return lines.map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = cells[idx] ?? '';
    });
    return row;
  });
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (ch === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

function normaliseItem(raw) {
  if (!raw || !raw.name) return null;
  return {
    id: raw.id || makeId(),
    name: raw.name,
    cat: raw.cat || 'All',
    layer: raw.layer || '',
    tags: ensureArray(raw.tags),
    zones: ensureArray(raw.zones),
    anchors: ensureArray(raw.anchors),
    supports: normaliseSupports(raw.supports),
    safetyNotes: raw.safetyNotes || raw.safety || '',
    safetyScore: normaliseScore(raw.safetyScore),
    access: ensureArray(raw.access),
    conflicts: raw.conflicts || '',
    effects: ensureArray(raw.effects),
    extraCats: ensureArray(raw.extraCats),
    typeDetail: raw.typeDetail || raw.type || '',
    sizeSpec: raw.sizeSpec || raw.size || '',
    baseAttachment: raw.baseAttachment || raw.base || '',
    material: raw.material || '',
    brand: raw.brand || raw.store || '',
    createdAt: raw.createdAt || new Date().toISOString()
  };
}

function supportsToText(supports) {
  const entries = Object.entries(supports || {});
  return entries.map(([anchor, uses]) => `${anchor}: ${Array.isArray(uses) ? uses.join('; ') : uses}`).join('\n');
}

function parseSupports(text) {
  if (!text) return {};
  const out = {};
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [anchor, rest] = line.split(':');
      if (!rest) return;
      out[anchor.trim()] = rest.split(/;|,/).map((entry) => entry.trim()).filter(Boolean);
    });
  return out;
}

function normaliseSupports(value) {
  if (!value) return {};
  if (typeof value === 'string') return parseSupports(value);
  if (Array.isArray(value)) {
    return value.reduce((acc, entry) => {
      if (!entry) return acc;
      const anchor = entry.anchor || entry.name;
      if (!anchor) return acc;
      acc[anchor] = ensureArray(entry.uses);
      return acc;
    }, {});
  }
  if (typeof value === 'object') {
    const acc = {};
    Object.entries(value).forEach(([anchor, uses]) => {
      acc[anchor] = ensureArray(uses);
    });
    return acc;
  }
  return {};
}

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => (typeof entry === 'string' ? entry.trim() : entry)).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? ensureArray(parsed) : [];
      } catch (_) {
        return trimmed.split(/[,;\n]/).map((part) => part.trim()).filter(Boolean);
      }
    }
    return trimmed.split(/[,;\n]/).map((part) => part.trim()).filter(Boolean);
  }
  return [];
}

function splitList(value) {
  if (!value) return [];
  return value.split(/[,;]/).map((entry) => entry.trim()).filter(Boolean);
}

function splitLines(value) {
  if (!value) return [];
  return value.split(/\n+/).map((entry) => entry.trim()).filter(Boolean);
}

function normaliseScore(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return clamp(value, 0, 5);
  if (typeof value === 'string' && value.trim() !== '') return clamp(Number(value), 0, 5);
  return null;
}

function sortInventory() {
  inventory.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

function persistInventory() {
  profileStore.replaceInventoryItems(inventory, meta.metaVersion);
}

function download(filename, data, type = 'text/plain') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCSV(items) {
  const headers = [
    'id',
    'name',
    'cat',
    'extraCats',
    'layer',
    'zones',
    'anchors',
    'tags',
    'access',
    'safetyScore',
    'safetyNotes',
    'conflicts',
    'effects',
    'supports',
    'typeDetail',
    'sizeSpec',
    'baseAttachment',
    'material',
    'brand'
  ];
  const rows = items.map((item) => [
    item.id,
    item.name,
    item.cat,
    (item.extraCats || []).join('; '),
    item.layer,
    (item.zones || []).join('; '),
    (item.anchors || []).join('; '),
    (item.tags || []).join('; '),
    (item.access || []).join('; '),
    typeof item.safetyScore === 'number' ? item.safetyScore : '',
    item.safetyNotes || '',
    item.conflicts || '',
    (item.effects || []).join('; '),
    supportsToText(item.supports || {}),
    item.typeDetail || '',
    item.sizeSpec || '',
    item.baseAttachment || '',
    item.material || '',
    item.brand || ''
  ]);
  return [headers.join(',')]
    .concat(rows.map((row) => row.map(escapeCsvCell).join(',')))
    .join('\n');
}

function escapeCsvCell(value) {
  const str = (value ?? '').toString();
  if (/[" ,\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function safeLocalStorage(action, key, value) {
  if (!window.localStorage) return null;
  try {
    if (action === 'get') return window.localStorage.getItem(key);
    if (action === 'set') window.localStorage.setItem(key, value);
    if (action === 'remove') window.localStorage.removeItem(key);
  } catch (err) {
    console.warn('Storage unavailable', err);
  }
  return null;
}

function track(event, detail = {}) {
  const record = { event, detail, ts: Date.now() };
  analyticsListeners.forEach((cb) => {
    try {
      cb(record);
    } catch (err) {
      console.warn('Inventory analytics callback failed', err);
    }
  });
  console.debug('[Inventory]', event, detail);
}

function exposeApi() {
  window.fdmInventory = {
    getItems: () => inventory.map((item) => ({ ...item })),
    getItemsByZone: (zone) =>
      inventory.filter((item) => (item.zones || []).includes(zone)).map((item) => ({ ...item })),
    getCategoryMeta: (cat) => ({
      anchors: anchorOptions(cat),
      hint: meta.hints?.[cat] || null,
      functions: meta.functions?.[cat] || []
    }),
    onAnalytics: (cb) => {
      if (typeof cb === 'function') analyticsListeners.push(cb);
    }
  };
}

function startTour(autoTrigger = false) {
  if (document.getElementById('tourOverlay')) return;
  const steps = [
    {
      title: 'Profile & exports',
      body: 'Name the dungeon, pull demo data, and export CSV/JSON snapshots for Cloudflare Pages or sharing.'
    },
    {
      title: 'Category rails',
      body: 'Use the left panel to narrow the library, then layer on anchor filters to keep placements logical.'
    },
    {
      title: 'Function focus',
      body: 'These passive chips remind the controller what each category typically does inside a scene.'
    },
    {
      title: 'Inventory table + inspector',
      body: 'Click a row to highlight anchors, safety notes, conflicts, and supports without leaving the main canvas.'
    },
    {
      title: 'Add / edit modal',
      body: 'Document exact zones, anchor permutations, consent access, and sensation effects for each asset.'
    }
  ];
  let idx = 0;
  const overlay = document.createElement('div');
  overlay.id = 'tourOverlay';
  overlay.style =
    'position:fixed;inset:0;background:rgba(5,5,8,.92);color:#fff;z-index:999;display:flex;align-items:center;justify-content:center;padding:20px';
  const card = document.createElement('div');
  card.style =
    'max-width:520px;width:100%;background:#111722;border:1px solid #343a45;border-radius:16px;padding:24px;box-shadow:0 14px 40px rgba(0,0,0,.45)';
  card.innerHTML = `
    <h2 style="margin:0 0 4px">Inventory walkthrough</h2>
    <p style="margin:0 0 16px;color:#c6d2ff">Five quick beats on how to navigate this tool.</p>
    <div id="tourStep"></div>
    <div style="display:flex;justify-content:space-between;margin-top:18px;gap:8px">
      <button class="btn" type="button" data-tour-prev>Back</button>
      <div style="display:flex;gap:8px">
        <button class="btn" type="button" data-tour-skip>${autoTrigger ? 'Skip tour' : 'Close'}</button>
        <button class="btn red" type="button" data-tour-next>Next</button>
      </div>
    </div>`;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  const stepEl = card.querySelector('#tourStep');
  const prevBtn = card.querySelector('[data-tour-prev]');
  const skipBtn = card.querySelector('[data-tour-skip]');
  const nextBtn = card.querySelector('[data-tour-next]');

  const renderStep = () => {
    const step = steps[idx];
    stepEl.innerHTML = `<h3 style="margin:0 0 6px">${step.title}</h3><p style="margin:0;color:#e3e8ff;line-height:1.5">${step.body}</p><div class="small" style="display:block;margin-top:10px;color:#8894b7">${idx + 1} / ${steps.length}</div>`;
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === steps.length - 1 ? 'Finish' : 'Next';
  };

  const closeTour = (markSeen) => {
    overlay.remove();
    if (markSeen || autoTrigger) safeLocalStorage('set', TOUR_KEY, '1');
  };

  prevBtn.addEventListener('click', () => {
    if (idx > 0) idx -= 1;
    renderStep();
  });
  skipBtn.addEventListener('click', () => closeTour(true));
  nextBtn.addEventListener('click', () => {
    if (idx < steps.length - 1) {
      idx += 1;
      renderStep();
      return;
    }
    closeTour(true);
  });

  renderStep();
}

function handleFatal(err) {
  console.error('[Inventory] Fatal', err);
  if (!dom.wrap) return;
  const alert = document.createElement('div');
  alert.className = 'panel';
  alert.style.borderColor = '#6f1a1a';
  alert.style.color = '#ffdede';
  alert.innerHTML = '<strong>Inventory failed to load.</strong> Open the console for details.';
  dom.wrap.prepend(alert);
}

function toast(msg) {
  console.info('[Inventory]', msg);
}

function esc(value) {
  return (value ?? '')
    .toString()
    .replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

function escAttr(value) {
  return esc(value).replace(/"/g, '&quot;');
}

function clamp(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `itm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEMO_ITEMS = [
  {
    id: 'demo-restraint-cuffs',
    name: 'Command cuffs (locking)',
    cat: 'Restraints',
    layer: 'Restraint',
    zones: ['WRIST_LEFT', 'WRIST_RIGHT'],
    anchors: ['Wrists', 'Elbows'],
    supports: { Wrists: ['Suspension cuffs', 'Bedframe tie'], Elbows: ['Prayer bind'] },
    safetyNotes: 'Check circulation every 15 minutes; keep key close.',
    safetyScore: 3,
    access: ['NIPPLES', 'CROTCH'],
    conflicts: 'Blocks forearm tickling unless released.',
    effects: ['Immobilize', 'Compression'],
    tags: ['Leather', 'Locking']
  },
  {
    id: 'demo-outfit-catsuit',
    name: 'Shadow-slick catsuit',
    cat: 'Outfits',
    layer: 'Outfit',
    zones: ['TORSO_OVERALL_FRONT', 'TORSO_OVERALL_BACK', 'ARMS_OVERALL', 'LEGS_OVERALL'],
    anchors: ['Torso wrap', 'Leg sheath'],
    supports: { 'Torso wrap': ['Chest harness overlay'], 'Leg sheath': ['Thigh strap integration'] },
    safetyNotes: 'Heavy rubber—add talc or base layer for long wear.',
    safetyScore: 4,
    access: ['NIPPLES', 'CROTCH', 'REAR'],
    conflicts: 'Blocks skin contact toys until zippers opened.',
    effects: ['Compression', 'Sweat play'],
    tags: ['Rubber', 'Full coverage']
  },
  {
    id: 'demo-furniture-bench',
    name: 'Atlas spanking bench',
    cat: 'Furniture',
    layer: 'Furniture',
    zones: ['TORSO_OVERALL_FRONT', 'ANUS', 'CHEST'],
    anchors: ['Table posts', 'Seat anchor', 'Head cradle'],
    supports: { 'Table posts': ['Wrist straps', 'Ankle cuffs'], 'Seat anchor': ['Thrusting machine mount'] },
    safetyNotes: 'Lock casters before mounting. Pad knees and abdomen.',
    safetyScore: 4,
    access: ['CROTCH', 'REAR'],
    conflicts: 'Requires 6×4 ft clearance; incompatible with suspension rigs.',
    effects: ['Support', 'Immobilize'],
    tags: ['Bench', 'Impact prep']
  }
];
