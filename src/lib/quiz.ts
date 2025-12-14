import type { QuizQuestion, QuizType, SRSItem } from '../types';
import { greekAlphabet, getLetterById } from '../data/alphabet';
import { getNounEndingById } from '../data/nounEndings';
import { getVerbEndingById } from '../data/verbEndings';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get random items from an array excluding certain items
 */
function getRandomItems<T>(array: T[], count: number, exclude?: T[]): T[] {
  const filtered = exclude ? array.filter(item => !exclude.includes(item)) : array;
  return shuffle(filtered).slice(0, count);
}

/**
 * Generate a unique question ID
 */
function generateQuestionId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate alphabet quiz questions
 */
export function generateAlphabetQuestion(
  srsItem: SRSItem,
  quizTypes?: QuizType[]
): QuizQuestion | null {
  const letterId = srsItem.id.replace('letter-', '');
  const letter = getLetterById(letterId);
  if (!letter) return null;

  // Available quiz types for alphabet
  const availableTypes: QuizType[] = quizTypes || [
    'letter-to-name',
    'name-to-letter',
    'lower-to-upper',
    'upper-to-lower',
  ];

  const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

  switch (selectedType) {
    case 'letter-to-name': {
      // Show Greek letter (lowercase), identify English name
      const correctAnswer = letter.name;
      const wrongAnswers = getRandomItems(
        greekAlphabet.map(l => l.name),
        3,
        [correctAnswer]
      );
      const options = shuffle([correctAnswer, ...wrongAnswers]);

      return {
        id: generateQuestionId(),
        type: 'letter-to-name',
        prompt: 'What is the name of this Greek letter?',
        promptDisplay: letter.lowercase,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'name-to-letter': {
      // Show English name, identify Greek letter (lowercase)
      const correctAnswer = letter.lowercase;
      const wrongAnswers = getRandomItems(
        greekAlphabet.map(l => l.lowercase),
        3,
        [correctAnswer]
      );
      const options = shuffle([correctAnswer, ...wrongAnswers]);

      return {
        id: generateQuestionId(),
        type: 'name-to-letter',
        prompt: `Which letter is "${letter.name}"?`,
        promptDisplay: letter.name,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'lower-to-upper': {
      // Show lowercase, identify uppercase
      const correctAnswer = letter.uppercase;
      const wrongAnswers = getRandomItems(
        greekAlphabet.map(l => l.uppercase),
        3,
        [correctAnswer]
      );
      const options = shuffle([correctAnswer, ...wrongAnswers]);

      return {
        id: generateQuestionId(),
        type: 'lower-to-upper',
        prompt: 'What is the uppercase form of this letter?',
        promptDisplay: letter.lowercase,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'upper-to-lower': {
      // Show uppercase, identify lowercase
      const correctAnswer = letter.lowercase;
      const wrongAnswers = getRandomItems(
        greekAlphabet.map(l => l.lowercase),
        3,
        [correctAnswer]
      );
      const options = shuffle([correctAnswer, ...wrongAnswers]);

      return {
        id: generateQuestionId(),
        type: 'upper-to-lower',
        prompt: 'What is the lowercase form of this letter?',
        promptDisplay: letter.uppercase,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    default:
      return null;
  }
}

/**
 * Generate noun parsing quiz questions
 */
export function generateNounQuestion(srsItem: SRSItem): QuizQuestion | null {
  const endingId = srsItem.id.replace('noun-', '');
  const ending = getNounEndingById(endingId);
  if (!ending) return null;

  // Generate question about case, gender, or number
  const questionTypes = ['case', 'gender', 'number'];
  const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (selectedQuestion) {
    case 'case': {
      const correctAnswer = ending.case;
      const options = shuffle(['nominative', 'genitive', 'dative', 'accusative', 'vocative']);

      return {
        id: generateQuestionId(),
        type: 'noun-parsing',
        prompt: `What case is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'gender': {
      const correctAnswer = ending.gender;
      const options = shuffle(['masculine', 'feminine', 'neuter']);

      return {
        id: generateQuestionId(),
        type: 'noun-parsing',
        prompt: `What gender is "${ending.ending}" (${ending.declension})?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'number': {
      const correctAnswer = ending.number;
      const options = shuffle(['singular', 'plural']);

      return {
        id: generateQuestionId(),
        type: 'noun-parsing',
        prompt: `What number is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    default:
      return null;
  }
}

/**
 * Generate full noun parsing question (all attributes at once)
 */
export function generateFullNounQuestion(srsItem: SRSItem): QuizQuestion | null {
  const endingId = srsItem.id.replace('noun-', '');
  const ending = getNounEndingById(endingId);
  if (!ending) return null;

  const correctAnswer = `${ending.case}, ${ending.gender}, ${ending.number}`;

  // Generate plausible wrong answers
  const cases = ['nominative', 'genitive', 'dative', 'accusative', 'vocative'];
  const genders = ['masculine', 'feminine', 'neuter'];
  const numbers = ['singular', 'plural'];

  const wrongAnswers: string[] = [];
  while (wrongAnswers.length < 3) {
    const c = cases[Math.floor(Math.random() * cases.length)];
    const g = genders[Math.floor(Math.random() * genders.length)];
    const n = numbers[Math.floor(Math.random() * numbers.length)];
    const answer = `${c}, ${g}, ${n}`;
    if (answer !== correctAnswer && !wrongAnswers.includes(answer)) {
      wrongAnswers.push(answer);
    }
  }

  const options = shuffle([correctAnswer, ...wrongAnswers]);

  return {
    id: generateQuestionId(),
    type: 'noun-parsing',
    prompt: `Parse this noun ending: "${ending.ending}"`,
    promptDisplay: ending.exampleWord || ending.ending,
    correctAnswer,
    options,
    relatedItemId: srsItem.id,
  };
}

/**
 * Generate verb parsing quiz questions
 */
export function generateVerbQuestion(srsItem: SRSItem): QuizQuestion | null {
  const endingId = srsItem.id.replace('verb-', '');
  const ending = getVerbEndingById(endingId);
  if (!ending) return null;

  // Generate question about tense, voice, mood, person, or number
  const questionTypes = ['tense', 'voice', 'mood', 'person', 'number'];
  const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (selectedQuestion) {
    case 'tense': {
      const correctAnswer = ending.tense;
      const options = shuffle(['present', 'imperfect', 'future', 'aorist', 'perfect', 'pluperfect']);

      return {
        id: generateQuestionId(),
        type: 'verb-parsing',
        prompt: `What tense is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'voice': {
      const correctAnswer = ending.voice;
      const options = shuffle(['active', 'middle', 'passive']);

      return {
        id: generateQuestionId(),
        type: 'verb-parsing',
        prompt: `What voice is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'mood': {
      const correctAnswer = ending.mood;
      const options = shuffle(['indicative', 'subjunctive', 'optative', 'imperative', 'infinitive', 'participle']);

      return {
        id: generateQuestionId(),
        type: 'verb-parsing',
        prompt: `What mood is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'person': {
      const correctAnswer = ending.person;
      const options = shuffle(['1st', '2nd', '3rd']);

      return {
        id: generateQuestionId(),
        type: 'verb-parsing',
        prompt: `What person is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    case 'number': {
      const correctAnswer = ending.number;
      const options = shuffle(['singular', 'plural']);

      return {
        id: generateQuestionId(),
        type: 'verb-parsing',
        prompt: `What number is the ending "${ending.ending}"?`,
        promptDisplay: ending.exampleWord || ending.ending,
        correctAnswer,
        options,
        relatedItemId: srsItem.id,
      };
    }

    default:
      return null;
  }
}

/**
 * Generate a full verb parsing question
 */
export function generateFullVerbQuestion(srsItem: SRSItem): QuizQuestion | null {
  const endingId = srsItem.id.replace('verb-', '');
  const ending = getVerbEndingById(endingId);
  if (!ending) return null;

  // For infinitive/participle, skip person
  let correctAnswer: string;
  if (ending.mood === 'infinitive' || ending.mood === 'participle') {
    correctAnswer = `${ending.tense}, ${ending.voice}, ${ending.mood}`;
  } else {
    correctAnswer = `${ending.tense}, ${ending.voice}, ${ending.mood}, ${ending.person}, ${ending.number}`;
  }

  // Generate plausible wrong answers
  const tenses = ['present', 'imperfect', 'future', 'aorist', 'perfect'];
  const voices = ['active', 'middle', 'passive'];
  const moods = ['indicative', 'subjunctive', 'imperative'];
  const persons = ['1st', '2nd', '3rd'];
  const numbers = ['singular', 'plural'];

  const wrongAnswers: string[] = [];
  while (wrongAnswers.length < 3) {
    const t = tenses[Math.floor(Math.random() * tenses.length)];
    const v = voices[Math.floor(Math.random() * voices.length)];
    const m = moods[Math.floor(Math.random() * moods.length)];
    const p = persons[Math.floor(Math.random() * persons.length)];
    const n = numbers[Math.floor(Math.random() * numbers.length)];
    const answer = `${t}, ${v}, ${m}, ${p}, ${n}`;
    if (answer !== correctAnswer && !wrongAnswers.includes(answer)) {
      wrongAnswers.push(answer);
    }
  }

  const options = shuffle([correctAnswer, ...wrongAnswers]);

  return {
    id: generateQuestionId(),
    type: 'verb-parsing',
    prompt: `Parse this verb form:`,
    promptDisplay: ending.exampleWord || ending.ending,
    correctAnswer,
    options,
    relatedItemId: srsItem.id,
  };
}

/**
 * Generate a quiz from SRS items
 */
export function generateQuiz(
  srsItems: SRSItem[],
  quizTypes?: QuizType[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const item of srsItems) {
    let question: QuizQuestion | null = null;

    if (item.itemType === 'letter') {
      question = generateAlphabetQuestion(item, quizTypes);
    } else if (item.itemType === 'noun-ending') {
      question = generateNounQuestion(item);
    } else if (item.itemType === 'verb-ending') {
      question = generateVerbQuestion(item);
    }

    if (question) {
      questions.push(question);
    }
  }

  return questions;
}
