export const PHASES = [
  { id: 'arrival', label: 'Arrival', desc: 'Welcome them inside the dungeon atmosphere.' },
  { id: 'induction', label: 'Induction', desc: 'Guide breath, counting, or fixation.' },
  { id: 'deepening', label: 'Deepening', desc: 'Layer restraints, sensory denial, surrender.' },
  { id: 'play', label: 'Play', desc: 'Active trance play, commands, worship.' },
  { id: 'release', label: 'Release', desc: 'Aftercare, re-integration, closing promise.' }
];

function createEmptyTimeline(phases) {
  return phases.reduce((acc, phase) => {
    acc[phase.id] = [];
    return acc;
  }, {});
}

export class HypnoGenerator {
  constructor(phases = PHASES) {
    this.phases = phases;
    this.timeline = createEmptyTimeline(phases);
  }

  reset() {
    this.timeline = createEmptyTimeline(this.phases);
  }

  addBlock(phaseId, block) {
    if (!this.timeline[phaseId]) return;
    const entry = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `${block.id}-${Date.now()}`,
      blockId: block.id,
      text: block.text,
      type: block.type,
      tone: block.tone,
      tags: block.tags || [],
      moods: block.moods || [],
      phases: block.phases || [],
      source: block
    };
    this.timeline[phaseId].push(entry);
    return entry;
  }

  removeBlock(phaseId, idx) {
    if (!this.timeline[phaseId]) return;
    this.timeline[phaseId].splice(idx, 1);
  }

  getTimeline() {
    return this.phases.map(phase => ({
      ...phase,
      blocks: [...(this.timeline[phase.id] || [])]
    }));
  }

  serialize() {
    return {
      phases: this.phases.map(phase => ({
        id: phase.id,
        blocks: (this.timeline[phase.id] || []).map(block => ({
          blockId: block.blockId,
          text: block.text,
          type: block.type,
          tone: block.tone,
          tags: block.tags,
          moods: block.moods,
          phases: block.phases
        }))
      })),
      updatedAt: Date.now()
    };
  }

  hydrate(snapshot = {}, library = []) {
    this.reset();
    if (!Array.isArray(snapshot.phases)) return;
    const lookup = library.reduce((acc, block) => {
      acc[block.id] = block;
      return acc;
    }, {});
    snapshot.phases.forEach(phase => {
      if (!this.timeline[phase.id] || !Array.isArray(phase.blocks)) return;
      phase.blocks.forEach(block => {
        const ref = lookup[block.blockId] || {};
        const payload = {
          uid: crypto.randomUUID ? crypto.randomUUID() : `${block.blockId}-${Math.random()}`,
          blockId: block.blockId,
          text: block.text || ref.text,
          type: block.type || ref.type,
          tone: block.tone || ref.tone,
          tags: block.tags || ref.tags || [],
          moods: block.moods || ref.moods || [],
          phases: block.phases || ref.phases || [],
          source: ref.id ? ref : block
        };
        this.timeline[phase.id].push(payload);
      });
    });
  }

  collectTags() {
    return this._collectUnique('tags');
  }

  collectMoods() {
    return this._collectUnique('moods');
  }

  _collectUnique(field) {
    const bucket = new Set();
    Object.values(this.timeline).forEach(items => {
      items.forEach(block => {
        (block[field] || []).forEach(val => bucket.add(val));
      });
    });
    return Array.from(bucket);
  }
}
