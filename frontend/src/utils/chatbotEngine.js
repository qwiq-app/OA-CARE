// Offline answer engine for the OA Care help assistant.
// Matches the user's message against the local knowledge base and exercise data
// using keyword/phrase scoring with light stemming and typo tolerance. No network calls.

import { intents, SUGGESTED_STARTERS } from '../data/chatbotKnowledge';
import { exercises } from '../data/exercises';
import { exerciseGuides } from '../data/exerciseGuides';

const STRONG_WEIGHT = 3;
const KEYWORD_WEIGHT = 1;
const MIN_SCORE = 2;

// Extra names people commonly use for each exercise (keyed by exercise title).
const EXERCISE_ALIASES = {
  'Straight Leg Raise': ['slr', 'leg raise', 'straight leg', 'leg lift'],
  'Quad Set': ['quad sets', 'quadriceps set', 'quad squeeze', 'quad set'],
  'Lying Quad Stretch': ['quad stretch', 'quadriceps stretch'],
  'Side-Lying Leg Raise': ['side leg raise', 'side lying leg raise', 'side lying'],
  Bridging: ['bridge', 'bridges', 'glute bridge', 'hip bridge'],
  'Step-Ups': ['step up', 'step ups', 'stepups', 'stepup'],
  'Sit-to-Stand': ['sit to stand', 'chair stand', 'sit stand'],
  'Mini Squats at Countertop': ['mini squat', 'mini squats', 'countertop squat', 'counter squat'],
  'Tandem Balance': ['tandem', 'tandem stance', 'heel to toe'],
  'Single-Leg Balance': ['single leg balance', 'one leg balance', 'one leg stand', 'single leg stand', 'stand on one leg'],
  'Calf Stretch with Towel': ['calf stretch', 'towel stretch', 'calf'],
  'Seated Hamstring Stretch': ['hamstring stretch', 'hamstring', 'hamstrings'],
  Plank: ['plank', 'planks'],
  Lunges: ['lunge', 'lunges'],
  Squats: ['squat', 'squats'],
  'Push-Ups': ['push up', 'push ups', 'pushup', 'pushups'],
  Burpees: ['burpee', 'burpees'],
  'Suspension Plank': ['suspension plank'],
  'Suspension Side Plank': ['side plank', 'suspension side plank'],
  'Mountain Climber (Suspension)': ['mountain climber', 'mountain climbers'],
};

const AREA_WORDS = { knee: 'knee', knees: 'knee', hip: 'hip', hips: 'hip' };
const LEVEL_WORDS = {
  beginner: 'Beginner', beginners: 'Beginner', easy: 'Beginner', simple: 'Beginner', gentle: 'Beginner',
  intermediate: 'Intermediate', medium: 'Intermediate', moderate: 'Intermediate',
  advanced: 'Advanced', hard: 'Advanced', difficult: 'Advanced', tough: 'Advanced',
};
const TYPE_WORDS = {
  strengthening: 'strengthening', strength: 'strengthening', strengthen: 'strengthening', strong: 'strengthening',
  stretching: 'stretching', stretch: 'stretching', stretches: 'stretching', flexibility: 'stretching',
  balance: 'balance', balancing: 'balance', stability: 'balance',
  cardio: 'cardio', aerobic: 'cardio',
};
const EXERCISE_WORDS = ['exercise', 'exercises', 'workout', 'workouts', 'routine'];
const LIST_PHRASES = ['show', 'list', 'which exercise', 'what exercise', 'recommend', 'suggest', 'best exercise', 'exercises for', 'all exercise', 'give me'];
const FOLLOW_UP_WORDS = ['it', 'this', 'that', 'sets', 'reps', 'how many', 'precaution', 'precautions', 'steps', 'how to do', 'how do i do', 'instructions', 'hold', 'safe'];

const STOPWORDS = new Set(
  'a an the is are am was were be to of in on at for with and or my me i you your it this that do does can could should would will what how why when which who please tell about any some there have has had get'.split(' '),
);

export function normalize(text) {
  return ` ${String(text)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

function stem(word) {
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  return word;
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = temp;
    }
  }
  return prev[b.length];
}

function wordMatches(token, keyword, fuzzy = true) {
  if (token === keyword) return true;
  // Short words (oa, hi, vs…) must match exactly to avoid false positives.
  if (keyword.length < 4 || token.length < 4) return false;
  if (stem(token) === stem(keyword)) return true;
  if (!fuzzy) return false;
  const allowed = keyword.length >= 8 ? 2 : keyword.length >= 5 ? 1 : 0;
  return allowed > 0 && levenshtein(token, keyword) <= allowed;
}

function termMatches(term, text, tokens, fuzzy) {
  const normalizedTerm = normalize(term).trim();
  if (!normalizedTerm) return false;
  if (normalizedTerm.includes(' ')) return text.includes(` ${normalizedTerm} `);
  return tokens.some((token) => wordMatches(token, normalizedTerm, fuzzy));
}

function scoreIntent(intent, text, tokens) {
  // Typo tolerance is off for safety-critical intents so e.g. "fewer" never reads as "fever".
  const fuzzy = !intent.priority;
  let score = 0;
  for (const term of intent.strong || []) if (termMatches(term, text, tokens, fuzzy)) score += STRONG_WEIGHT;
  for (const term of intent.keywords || []) if (termMatches(term, text, tokens, fuzzy)) score += KEYWORD_WEIGHT;
  return score;
}

function findExercise(text, tokens) {
  let best = null;
  for (const ex of exercises) {
    const names = [ex.title, ...(EXERCISE_ALIASES[ex.title] || [])];
    for (const name of names) {
      const n = normalize(name).trim();
      const hit = n.includes(' ') ? text.includes(` ${n} `) : tokens.some((t) => wordMatches(t, n));
      // Prefer the longest matching name so "suspension plank" beats "plank".
      if (hit && (!best || n.length > best.length)) best = { exercise: ex, length: n.length };
    }
  }
  return best?.exercise || null;
}

function extractFilters(tokens) {
  const filters = {};
  for (const token of tokens) {
    if (AREA_WORDS[token]) filters.area = AREA_WORDS[token];
    if (LEVEL_WORDS[token]) filters.level = LEVEL_WORDS[token];
    if (TYPE_WORDS[token]) filters.type = TYPE_WORDS[token];
  }
  return filters;
}

function capitalize(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

function exerciseLink(ex, exerciseIds) {
  const dbId = exerciseIds?.[ex.title.toLowerCase()];
  return { label: `Open ${ex.title}`, to: dbId ? `/exercises/${dbId}` : '/exercises' };
}

function describeExercise(ex, exerciseIds, focus) {
  const guide = exerciseGuides[ex.title] || {};
  const steps = guide.instructions || [];
  const header = `**${ex.title}** — ${capitalize(ex.area)} · ${ex.level} · ${capitalize(ex.type)} · ${ex.sets}`;

  let body;
  if (focus === 'precautions') {
    body = guide.precautions
      ? `⚠️ **Precaution:** ${guide.precautions}`
      : 'No specific precaution is listed for this one. Move slowly, stay within a comfortable range, and stop if pain becomes severe.';
  } else if (focus === 'dosage') {
    body = `Recommended: **${ex.sets}**${guide.hold_seconds ? `, holding each for ${guide.hold_seconds} seconds` : ''}.`;
  } else {
    const parts = [];
    if (guide.description) parts.push(guide.description);
    if (steps.length) parts.push(`**How to do it:**\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
    if (guide.precautions) parts.push(`⚠️ **Precaution:** ${guide.precautions}`);
    body = parts.join('\n\n');
  }

  return {
    text: `${header}\n\n${body}\n\nStop if you feel sharp or severe pain, and check with your physiotherapist if unsure.`,
    links: [exerciseLink(ex, exerciseIds), { label: 'Exercise library', to: '/exercises' }],
    followUps: focus ? [`How to do ${ex.title}?`] : [`Precautions for ${ex.title}`, `Similar ${ex.area} exercises`],
    context: { exercise: ex.title },
  };
}

function listExercises(filters, exerciseIds) {
  const matches = exercises.filter(
    (ex) =>
      (!filters.area || ex.area === filters.area) &&
      (!filters.level || ex.level === filters.level) &&
      (!filters.type || ex.type === filters.type),
  );

  const label = [filters.level, filters.area, filters.type].filter(Boolean).join(' ').toLowerCase();
  if (!matches.length && filters.level) {
    // e.g. there are no beginner hip exercises – show that area/type at any level instead.
    const relaxed = listExercises({ ...filters, level: undefined }, exerciseIds);
    return { ...relaxed, text: `There are no ${label} exercises in our library. ${relaxed.text}` };
  }
  if (!matches.length) {
    return {
      text: `I couldn't find ${label} exercises in our library. Try asking for knee or hip exercises, or a level like beginner.`,
      links: [{ label: 'Exercise library', to: '/exercises' }],
      followUps: ['Show knee exercises', 'Show hip exercises'],
    };
  }

  const lines = matches.map((ex) => `• **${ex.title}** — ${ex.level}, ${ex.type}, ${ex.sets}`);
  const isFiltered = Boolean(label);
  return {
    text: `${isFiltered ? `Here are the ${label} exercises` : 'Here are all the exercises'} in our library (${matches.length}):\n${lines.join('\n')}\n\nAsk me about any of them, e.g. "how to do ${matches[0].title}".`,
    links: [{ label: 'Exercise library', to: '/exercises' }, ...matches.slice(0, 2).map((ex) => exerciseLink(ex, exerciseIds))],
    followUps: matches.slice(0, 3).map((ex) => `How to do ${ex.title}?`),
  };
}

function fromIntent(intent) {
  return {
    text: intent.answer,
    links: intent.links || [],
    followUps: intent.followUps || [],
    intentId: intent.id,
  };
}

/**
 * Produce a reply for a user message.
 * @param {string} message      raw user text
 * @param {object} options
 * @param {object} options.context      state from the previous reply ({ exercise })
 * @param {object} options.exerciseIds  map of lower-cased exercise title → database id
 * @param {string} options.userName     logged-in user's first name, if any
 */
export function getBotReply(message, { context = {}, exerciseIds = {}, userName } = {}) {
  const text = normalize(message);
  const tokens = text.trim().split(' ').filter(Boolean);
  const meaningful = tokens.filter((t) => !STOPWORDS.has(t));

  if (!meaningful.length) {
    return {
      text: 'Could you tell me a bit more about what you need help with?',
      followUps: SUGGESTED_STARTERS,
    };
  }

  const scored = intents
    .map((intent) => ({ intent, score: scoreIntent(intent, text, tokens) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  // 1. Safety first: red-flag symptoms always get the emergency answer.
  const emergency = scored.find((s) => s.intent.priority && s.score >= STRONG_WEIGHT);
  if (emergency) return fromIntent(emergency.intent);

  // 2. A specific exercise named in the message.
  const focus = /precaution|careful|avoid|safe|caution|warning/.test(text)
    ? 'precautions'
    : /how many|sets|reps|repetition|hold|how long/.test(text)
      ? 'dosage'
      : null;
  const exercise = findExercise(text, tokens);
  const filters = extractFilters(tokens);

  if (exercise) {
    if (/similar|other|more|like this/.test(text)) {
      return listExercises({ area: exercise.area }, exerciseIds);
    }
    return describeExercise(exercise, exerciseIds, focus);
  }

  // 3. A request to list/filter exercises.
  const mentionsExercise = tokens.some((t) => EXERCISE_WORDS.includes(t));
  const hasFilter = Object.keys(filters).length > 0;
  const asksForList = LIST_PHRASES.some((p) => text.includes(` ${p}`));
  if (mentionsExercise && (hasFilter || asksForList) && best.score < STRONG_WEIGHT) {
    return listExercises(filters, exerciseIds);
  }

  // 4. Follow-up about the exercise discussed in the previous turn.
  const previous = context.exercise && exercises.find((ex) => ex.title === context.exercise);
  if (previous && best.score < STRONG_WEIGHT && FOLLOW_UP_WORDS.some((w) => text.includes(` ${w} `))) {
    return describeExercise(previous, exerciseIds, focus);
  }

  // 5. Best-matching knowledge base topic.
  if (best.score >= MIN_SCORE) {
    const reply = fromIntent(best.intent);
    if (best.intent.id === 'greeting' && userName) {
      reply.text = reply.text.replace('Hello!', `Hello, ${userName}!`);
    }
    return reply;
  }

  if (mentionsExercise) return listExercises(filters, exerciseIds);

  // 6. Weak match. Short questions ("wat is osteoarthritis") get the answer directly;
  //    longer ones get it offered as a suggestion.
  if (best.score > 0 && meaningful.length <= 2) return fromIntent(best.intent);
  if (best.score > 0) {
    return {
      ...fromIntent(best.intent),
      text: `I think you're asking about this — let me know if not:\n\n${best.intent.answer}`,
    };
  }

  return {
    text:
      "Sorry, I don't have an answer for that yet. I can help with osteoarthritis information, exercises, treatments, and using this site. Try one of these, or browse the FAQ.",
    links: [{ label: 'FAQ', to: '/faq' }, { label: 'Resources & contact', to: '/resources' }],
    followUps: SUGGESTED_STARTERS,
    unanswered: true,
  };
}
