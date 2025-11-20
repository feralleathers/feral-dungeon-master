const TOPIC_URL = new URL('../../data/hypno-topics.json', import.meta.url);
let topicCache = [];
let loaded = false;

export async function loadTopics(force = false) {
  if (loaded && !force) return topicCache;
  const res = await fetch(TOPIC_URL);
  if (!res.ok) throw new Error('Unable to load topic library');
  topicCache = await res.json();
  loaded = true;
  return topicCache;
}

export function flattenTopicPhrases(topics = topicCache) {
  const blocks = [];
  topics.forEach(topic => {
    (topic.subs || []).forEach(sub => {
      (sub.phrases || []).forEach((text, idx) => {
        blocks.push({
          id: `${topic.id}__${sub.id}__${idx}`,
          topicId: topic.id,
          subId: sub.id,
          topicLabel: topic.label,
          subLabel: sub.label,
          description: sub.description || '',
          type: sub.type || 'verse',
          tone: sub.tone || 'commanding',
          tags: [...(topic.tags || []), ...(sub.tags || []), sub.id],
          moods: sub.moods || [],
          phases: sub.phases || [],
          text
        });
      });
    });
  });
  return blocks;
}

export function getTopicById(id) {
  return topicCache.find(topic => topic.id === id);
}

export function getSubById(topicId, subId) {
  const topic = getTopicById(topicId);
  if (!topic) return null;
  return (topic.subs || []).find(sub => sub.id === subId);
}
