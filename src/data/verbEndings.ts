import type { VerbEnding } from '../types';

// Present Active Indicative - λύω paradigm
const presentActiveIndicative: VerbEnding[] = [
  { id: 'pres-act-ind-1s', ending: '-ω', tense: 'present', voice: 'active', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'λύω', exampleMeaning: 'I loose' },
  { id: 'pres-act-ind-2s', ending: '-εις', tense: 'present', voice: 'active', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'λύεις', exampleMeaning: 'you loose' },
  { id: 'pres-act-ind-3s', ending: '-ει', tense: 'present', voice: 'active', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'λύει', exampleMeaning: 'he/she/it looses' },
  { id: 'pres-act-ind-1p', ending: '-ομεν', tense: 'present', voice: 'active', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'λύομεν', exampleMeaning: 'we loose' },
  { id: 'pres-act-ind-2p', ending: '-ετε', tense: 'present', voice: 'active', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'λύετε', exampleMeaning: 'you (pl) loose' },
  { id: 'pres-act-ind-3p', ending: '-ουσι(ν)', tense: 'present', voice: 'active', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'λύουσι(ν)', exampleMeaning: 'they loose' },
];

// Present Middle/Passive Indicative
const presentMiddlePassiveIndicative: VerbEnding[] = [
  { id: 'pres-mp-ind-1s', ending: '-ομαι', tense: 'present', voice: 'middle', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'λύομαι', exampleMeaning: 'I am loosed / I loose for myself' },
  { id: 'pres-mp-ind-2s', ending: '-ῃ / -ει', tense: 'present', voice: 'middle', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'λύῃ', exampleMeaning: 'you are loosed' },
  { id: 'pres-mp-ind-3s', ending: '-εται', tense: 'present', voice: 'middle', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'λύεται', exampleMeaning: 'he/she/it is loosed' },
  { id: 'pres-mp-ind-1p', ending: '-όμεθα', tense: 'present', voice: 'middle', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'λυόμεθα', exampleMeaning: 'we are loosed' },
  { id: 'pres-mp-ind-2p', ending: '-εσθε', tense: 'present', voice: 'middle', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'λύεσθε', exampleMeaning: 'you (pl) are loosed' },
  { id: 'pres-mp-ind-3p', ending: '-ονται', tense: 'present', voice: 'middle', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'λύονται', exampleMeaning: 'they are loosed' },
];

// Imperfect Active Indicative
const imperfectActiveIndicative: VerbEnding[] = [
  { id: 'impf-act-ind-1s', ending: '-ον', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'ἔλυον', exampleMeaning: 'I was loosing' },
  { id: 'impf-act-ind-2s', ending: '-ες', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'ἔλυες', exampleMeaning: 'you were loosing' },
  { id: 'impf-act-ind-3s', ending: '-ε(ν)', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'ἔλυε(ν)', exampleMeaning: 'he/she/it was loosing' },
  { id: 'impf-act-ind-1p', ending: '-ομεν', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'ἐλύομεν', exampleMeaning: 'we were loosing' },
  { id: 'impf-act-ind-2p', ending: '-ετε', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'ἐλύετε', exampleMeaning: 'you (pl) were loosing' },
  { id: 'impf-act-ind-3p', ending: '-ον', tense: 'imperfect', voice: 'active', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'ἔλυον', exampleMeaning: 'they were loosing' },
];

// Future Active Indicative
const futureActiveIndicative: VerbEnding[] = [
  { id: 'fut-act-ind-1s', ending: '-σω', tense: 'future', voice: 'active', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'λύσω', exampleMeaning: 'I will loose' },
  { id: 'fut-act-ind-2s', ending: '-σεις', tense: 'future', voice: 'active', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'λύσεις', exampleMeaning: 'you will loose' },
  { id: 'fut-act-ind-3s', ending: '-σει', tense: 'future', voice: 'active', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'λύσει', exampleMeaning: 'he/she/it will loose' },
  { id: 'fut-act-ind-1p', ending: '-σομεν', tense: 'future', voice: 'active', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'λύσομεν', exampleMeaning: 'we will loose' },
  { id: 'fut-act-ind-2p', ending: '-σετε', tense: 'future', voice: 'active', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'λύσετε', exampleMeaning: 'you (pl) will loose' },
  { id: 'fut-act-ind-3p', ending: '-σουσι(ν)', tense: 'future', voice: 'active', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'λύσουσι(ν)', exampleMeaning: 'they will loose' },
];

// Aorist Active Indicative (First/Weak Aorist)
const aoristActiveIndicative: VerbEnding[] = [
  { id: 'aor-act-ind-1s', ending: '-σα', tense: 'aorist', voice: 'active', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'ἔλυσα', exampleMeaning: 'I loosed' },
  { id: 'aor-act-ind-2s', ending: '-σας', tense: 'aorist', voice: 'active', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'ἔλυσας', exampleMeaning: 'you loosed' },
  { id: 'aor-act-ind-3s', ending: '-σε(ν)', tense: 'aorist', voice: 'active', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'ἔλυσε(ν)', exampleMeaning: 'he/she/it loosed' },
  { id: 'aor-act-ind-1p', ending: '-σαμεν', tense: 'aorist', voice: 'active', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'ἐλύσαμεν', exampleMeaning: 'we loosed' },
  { id: 'aor-act-ind-2p', ending: '-σατε', tense: 'aorist', voice: 'active', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'ἐλύσατε', exampleMeaning: 'you (pl) loosed' },
  { id: 'aor-act-ind-3p', ending: '-σαν', tense: 'aorist', voice: 'active', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'ἔλυσαν', exampleMeaning: 'they loosed' },
];

// Perfect Active Indicative
const perfectActiveIndicative: VerbEnding[] = [
  { id: 'perf-act-ind-1s', ending: '-κα', tense: 'perfect', voice: 'active', mood: 'indicative', person: '1st', number: 'singular', exampleWord: 'λέλυκα', exampleMeaning: 'I have loosed' },
  { id: 'perf-act-ind-2s', ending: '-κας', tense: 'perfect', voice: 'active', mood: 'indicative', person: '2nd', number: 'singular', exampleWord: 'λέλυκας', exampleMeaning: 'you have loosed' },
  { id: 'perf-act-ind-3s', ending: '-κε(ν)', tense: 'perfect', voice: 'active', mood: 'indicative', person: '3rd', number: 'singular', exampleWord: 'λέλυκε(ν)', exampleMeaning: 'he/she/it has loosed' },
  { id: 'perf-act-ind-1p', ending: '-καμεν', tense: 'perfect', voice: 'active', mood: 'indicative', person: '1st', number: 'plural', exampleWord: 'λελύκαμεν', exampleMeaning: 'we have loosed' },
  { id: 'perf-act-ind-2p', ending: '-κατε', tense: 'perfect', voice: 'active', mood: 'indicative', person: '2nd', number: 'plural', exampleWord: 'λελύκατε', exampleMeaning: 'you (pl) have loosed' },
  { id: 'perf-act-ind-3p', ending: '-κασι(ν)', tense: 'perfect', voice: 'active', mood: 'indicative', person: '3rd', number: 'plural', exampleWord: 'λελύκασι(ν)', exampleMeaning: 'they have loosed' },
];

// Present Active Subjunctive
const presentActiveSubjunctive: VerbEnding[] = [
  { id: 'pres-act-subj-1s', ending: '-ω', tense: 'present', voice: 'active', mood: 'subjunctive', person: '1st', number: 'singular', exampleWord: 'λύω', exampleMeaning: 'I may loose' },
  { id: 'pres-act-subj-2s', ending: '-ῃς', tense: 'present', voice: 'active', mood: 'subjunctive', person: '2nd', number: 'singular', exampleWord: 'λύῃς', exampleMeaning: 'you may loose' },
  { id: 'pres-act-subj-3s', ending: '-ῃ', tense: 'present', voice: 'active', mood: 'subjunctive', person: '3rd', number: 'singular', exampleWord: 'λύῃ', exampleMeaning: 'he/she/it may loose' },
  { id: 'pres-act-subj-1p', ending: '-ωμεν', tense: 'present', voice: 'active', mood: 'subjunctive', person: '1st', number: 'plural', exampleWord: 'λύωμεν', exampleMeaning: 'we may loose' },
  { id: 'pres-act-subj-2p', ending: '-ητε', tense: 'present', voice: 'active', mood: 'subjunctive', person: '2nd', number: 'plural', exampleWord: 'λύητε', exampleMeaning: 'you (pl) may loose' },
  { id: 'pres-act-subj-3p', ending: '-ωσι(ν)', tense: 'present', voice: 'active', mood: 'subjunctive', person: '3rd', number: 'plural', exampleWord: 'λύωσι(ν)', exampleMeaning: 'they may loose' },
];

// Present Active Imperative
const presentActiveImperative: VerbEnding[] = [
  { id: 'pres-act-imp-2s', ending: '-ε', tense: 'present', voice: 'active', mood: 'imperative', person: '2nd', number: 'singular', exampleWord: 'λῦε', exampleMeaning: 'loose! (singular)' },
  { id: 'pres-act-imp-3s', ending: '-έτω', tense: 'present', voice: 'active', mood: 'imperative', person: '3rd', number: 'singular', exampleWord: 'λυέτω', exampleMeaning: 'let him/her loose!' },
  { id: 'pres-act-imp-2p', ending: '-ετε', tense: 'present', voice: 'active', mood: 'imperative', person: '2nd', number: 'plural', exampleWord: 'λύετε', exampleMeaning: 'loose! (plural)' },
  { id: 'pres-act-imp-3p', ending: '-έτωσαν', tense: 'present', voice: 'active', mood: 'imperative', person: '3rd', number: 'plural', exampleWord: 'λυέτωσαν', exampleMeaning: 'let them loose!' },
];

// Present Active Infinitive
const presentActiveInfinitive: VerbEnding[] = [
  { id: 'pres-act-inf', ending: '-ειν', tense: 'present', voice: 'active', mood: 'infinitive', person: '1st', number: 'singular', exampleWord: 'λύειν', exampleMeaning: 'to loose' },
];

// Present Active Participle (basic forms)
const presentActiveParticiple: VerbEnding[] = [
  { id: 'pres-act-ptc-m-nom-s', ending: '-ων', tense: 'present', voice: 'active', mood: 'participle', person: '1st', number: 'singular', exampleWord: 'λύων', exampleMeaning: 'loosing (masc nom sg)' },
  { id: 'pres-act-ptc-f-nom-s', ending: '-ουσα', tense: 'present', voice: 'active', mood: 'participle', person: '2nd', number: 'singular', exampleWord: 'λύουσα', exampleMeaning: 'loosing (fem nom sg)' },
  { id: 'pres-act-ptc-n-nom-s', ending: '-ον', tense: 'present', voice: 'active', mood: 'participle', person: '3rd', number: 'singular', exampleWord: 'λῦον', exampleMeaning: 'loosing (neut nom sg)' },
];

export const verbEndings: VerbEnding[] = [
  ...presentActiveIndicative,
  ...presentMiddlePassiveIndicative,
  ...imperfectActiveIndicative,
  ...futureActiveIndicative,
  ...aoristActiveIndicative,
  ...perfectActiveIndicative,
  ...presentActiveSubjunctive,
  ...presentActiveImperative,
  ...presentActiveInfinitive,
  ...presentActiveParticiple,
];

export const getVerbEndingById = (id: string): VerbEnding | undefined => {
  return verbEndings.find(ending => ending.id === id);
};

export const getVerbEndingsByTense = (tense: string): VerbEnding[] => {
  return verbEndings.filter(ending => ending.tense === tense);
};

export const getVerbEndingsByVoice = (voice: string): VerbEnding[] => {
  return verbEndings.filter(ending => ending.voice === voice);
};

export const getVerbEndingsByMood = (mood: string): VerbEnding[] => {
  return verbEndings.filter(ending => ending.mood === mood);
};

export const getUniqueTenses = (): string[] => {
  return ['present', 'imperfect', 'future', 'aorist', 'perfect', 'pluperfect'];
};

export const getUniqueVoices = (): string[] => {
  return ['active', 'middle', 'passive'];
};

export const getUniqueMoods = (): string[] => {
  return ['indicative', 'subjunctive', 'optative', 'imperative', 'infinitive', 'participle'];
};

export const getUniquePersons = (): string[] => {
  return ['1st', '2nd', '3rd'];
};
