const DATA_URL = new URL('../../data/poetry.json', import.meta.url);
let cache = [];
let loaded = false;

const uniq = values => Array.from(new Set(values)).filter(Boolean).sort();

export async function loadBlocks(force = false) {
  if (loaded && !force) return cache;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Unable to load poetry library');
  cache = await res.json();
  loaded = true;
  return cache;
}

export function getCachedBlocks() {
  return cache.slice();
}

export function buildFilterOptions(blocks = cache) {
  return {
    tones: uniq(blocks.map(b => b.tone)),
    types: uniq(blocks.map(b => b.type)),
    moods: uniq(blocks.flatMap(b => b.moods || [])),
    tags: uniq(blocks.flatMap(b => b.tags || [])),
    phases: uniq(blocks.flatMap(b => b.phases || []))
  };
}

export function rankBlocks(blocks, query = {}) {
  const { tone, type, moods = [], tags = [], phases = [], search = '' } = query;
  const moodSet = new Set(moods.filter(Boolean));
  const tagSet = new Set(tags.filter(Boolean));
  const phaseSet = new Set(phases.filter(Boolean));
  const searchTerm = search.trim().toLowerCase();

  return blocks
    .map(block => {
      if (tone && block.tone !== tone) return null;
      if (type && block.type !== type) return null;
      if (phaseSet.size && !(block.phases || []).some(p => phaseSet.has(p))) return null;
      if (moodSet.size && !(block.moods || []).some(m => moodSet.has(m))) return null;
      if (tagSet.size && !(block.tags || []).some(t => tagSet.has(t))) return null;
      if (searchTerm) {
        const haystack = `${block.text} ${block.tone} ${block.type}`.toLowerCase();
        if (!haystack.includes(searchTerm)) return null;
      }

      let score = 0;
      (block.tags || []).forEach(tag => { if (tagSet.has(tag)) score += 2; });
      (block.moods || []).forEach(mood => { if (moodSet.has(mood)) score += 1.5; });
      (block.phases || []).forEach(phase => { if (phaseSet.has(phase)) score += 1; });
      if (block.tone === tone) score += 1;
      if (block.type === type) score += 1;
      return { ...block, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

export function findBlockById(id) {
  return cache.find(b => b.id === id);
}
