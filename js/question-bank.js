export const PERSONA_POSITION_OPTIONS = ['Top', 'Verse', 'Bottom'];
export const PERSONA_DYNAMIC_OPTIONS = ['Dom', 'Switch', 'Sub'];
export const QUESTION_BANK_STORAGE_KEY = 'fdm_question_bank.v1';

export const QUESTION_BANK_CATEGORIES = [
  {
    id: 'bodies',
    label: 'Bodies',
    description: 'Self & partner focus',
    options: ['Skinny', 'Chubby', 'Small breasts', 'Large breasts', 'Small cocks', 'Large cocks']
  },
  {
    id: 'clothing',
    label: 'Clothing',
    description: 'Apparel & attire',
    options: ['Clothed sex', 'Lingerie', 'Stockings', 'Heels', 'Leather', 'Latex', 'Uniform / costume', 'Cross-dressing']
  },
  {
    id: 'groupings',
    label: 'Groupings',
    description: 'Scenes with numbers & combinations',
    options: ['You and 1 male', 'You and 1 female', 'You and M & F', 'You and 2 males', 'You and 2 females', 'Orgies']
  },
  {
    id: 'general',
    label: 'General play',
    description: 'Deep affection + sensation',
    options: ['Romance', 'Affection', 'Handjobs', 'Oral', 'Swallowing', 'Facials', 'Face-sitting', 'Edging', 'Teasing']
  },
  {
    id: 'sexualPositions',
    label: 'Sexual positions',
    description: 'Where you lead',
    options: PERSONA_POSITION_OPTIONS
  },
  {
    id: 'sexualDynamics',
    label: 'Sexual dynamics',
    description: 'Dominance preferences',
    options: PERSONA_DYNAMIC_OPTIONS
  },
  {
    id: 'assPlay',
    label: 'Ass play',
    description: 'Anal focus',
    options: ['Anal toys', 'Anal sex', 'Pegging', 'Rimming', 'Double penetration', 'Multiple penetration', 'Firsting', 'Large toys']
  },
  {
    id: 'restrictive',
    label: 'Restrictive',
    description: 'Restraints & control',
    options: ['Gag', 'Collar', 'Leash', 'Chastity', 'Bondage (light)', 'Bondage (heavy)', 'Bondage (longterm)', 'Encasement', 'Rope', 'Metal bondage', 'Imprisoned', 'Caged']
  },
  {
    id: 'toys',
    label: 'Toys',
    description: 'Implements',
    options: ['Dildos', 'Plugs', 'Vibrators', 'Sounding']
  },
  {
    id: 'domination',
    label: 'Domination',
    description: 'Power exchange',
    options: ['Dominant / submissive', 'Domestic servitude', 'Slavery', 'Pet play', 'DDLG', 'MDLB', 'Discipline', 'Begging', 'Forced orgasm', 'Orgasm control', 'Orgasm denial', 'Power exchange']
  },
  {
    id: 'cnc',
    label: 'Consensual non-consent',
    description: 'CNC & edge',
    options: ['CNC', 'Blackmail / coercion', 'Kidnapping', 'Drugs / alcohol', 'Sleep play']
  },
  {
    id: 'taboo',
    label: 'Taboo & edges',
    description: 'Transgressive play',
    options: ['Cheating', 'Exhibitionism', 'Voyeurism']
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    description: 'Transformation & creatures',
    options: ['Furry', 'Vore', 'Transformation', 'Aliens & monsters', 'Tentacles']
  },
  {
    id: 'fluids',
    label: 'Fluids',
    description: 'Liquid obsessions',
    options: ['Sweat', 'Watersports', 'Blood', 'Lactation', 'Cum play']
  },
  {
    id: 'degradation',
    label: 'Degradation',
    description: 'Verbal & physical degradation',
    options: ['Free-use', 'Name calling', 'Humiliation', 'Degradation']
  },
  {
    id: 'touch',
    label: 'Touch & stimulation',
    description: 'Physical worship',
    options: ['Cock worship', 'Vaginal worship', 'Tickling', 'Sensation play', 'Cold play', 'Hot play', 'E-stim', 'Leather', 'Latex']
  },
  {
    id: 'kinks',
    label: 'Kinks & fetishes',
    description: 'Niche proclivities',
    options: ['Pup play', 'ABDL', 'Drone-play', 'Military', 'Interrogations', 'Furry']
  }
];

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function buildQuestionnaireDefaults() {
  const sections = QUESTION_BANK_CATEGORIES.reduce((acc, category) => {
    acc[category.id] = (category.options || []).reduce((section, option) => {
      section[option] = 'neutral';
      return section;
    }, {});
    return acc;
  }, {});
  return {
    persona: {
      sexualPosition: PERSONA_POSITION_OPTIONS[0],
      sexualDynamic: PERSONA_DYNAMIC_OPTIONS[0]
    },
    sections
  };
}

export function loadQuestionBank() {
  const base = clone(QUESTION_BANK_CATEGORIES);
  if (!canUseLocalStorage()) return base;
  try {
    const raw = localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
    if (!raw) return base;
    const overrides = JSON.parse(raw);
    if (typeof overrides !== 'object' || overrides === null) return base;
    return base.map((category) => {
      if (!Array.isArray(overrides[category.id]?.options)) return category;
      return { ...category, options: overrides[category.id].options.slice() };
    });
  } catch (err) {
    console.warn('[question-bank] Could not load overrides', err);
    return base;
  }
}

export function persistQuestionBank(bank) {
  if (!canUseLocalStorage()) return;
  try {
    const payload = (bank || []).reduce((acc, category) => {
      acc[category.id] = { options: category.options.slice() };
      return acc;
    }, {});
    localStorage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[question-bank] Unable to persist overrides', err);
  }
}
