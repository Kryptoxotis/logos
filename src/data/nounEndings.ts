import type { NounEnding } from '../types';

// First Declension - Feminine (η pattern)
const firstDeclensionEta: NounEnding[] = [
  // Singular
  { id: '1d-eta-nom-s', ending: '-η', case: 'nominative', gender: 'feminine', number: 'singular', declension: '1st-eta', exampleWord: 'φωνή', exampleMeaning: 'voice' },
  { id: '1d-eta-gen-s', ending: '-ης', case: 'genitive', gender: 'feminine', number: 'singular', declension: '1st-eta', exampleWord: 'φωνῆς', exampleMeaning: 'of voice' },
  { id: '1d-eta-dat-s', ending: '-ῃ', case: 'dative', gender: 'feminine', number: 'singular', declension: '1st-eta', exampleWord: 'φωνῇ', exampleMeaning: 'to/for voice' },
  { id: '1d-eta-acc-s', ending: '-ην', case: 'accusative', gender: 'feminine', number: 'singular', declension: '1st-eta', exampleWord: 'φωνήν', exampleMeaning: 'voice (object)' },
  { id: '1d-eta-voc-s', ending: '-η', case: 'vocative', gender: 'feminine', number: 'singular', declension: '1st-eta', exampleWord: 'φωνή', exampleMeaning: 'O voice!' },
  // Plural
  { id: '1d-eta-nom-p', ending: '-αι', case: 'nominative', gender: 'feminine', number: 'plural', declension: '1st-eta', exampleWord: 'φωναί', exampleMeaning: 'voices' },
  { id: '1d-eta-gen-p', ending: '-ῶν', case: 'genitive', gender: 'feminine', number: 'plural', declension: '1st-eta', exampleWord: 'φωνῶν', exampleMeaning: 'of voices' },
  { id: '1d-eta-dat-p', ending: '-αις', case: 'dative', gender: 'feminine', number: 'plural', declension: '1st-eta', exampleWord: 'φωναῖς', exampleMeaning: 'to/for voices' },
  { id: '1d-eta-acc-p', ending: '-ας', case: 'accusative', gender: 'feminine', number: 'plural', declension: '1st-eta', exampleWord: 'φωνάς', exampleMeaning: 'voices (object)' },
  { id: '1d-eta-voc-p', ending: '-αι', case: 'vocative', gender: 'feminine', number: 'plural', declension: '1st-eta', exampleWord: 'φωναί', exampleMeaning: 'O voices!' },
];

// First Declension - Feminine (α pure pattern)
const firstDeclensionAlpha: NounEnding[] = [
  // Singular
  { id: '1d-alpha-nom-s', ending: '-α', case: 'nominative', gender: 'feminine', number: 'singular', declension: '1st-alpha', exampleWord: 'ἡμέρα', exampleMeaning: 'day' },
  { id: '1d-alpha-gen-s', ending: '-ας', case: 'genitive', gender: 'feminine', number: 'singular', declension: '1st-alpha', exampleWord: 'ἡμέρας', exampleMeaning: 'of day' },
  { id: '1d-alpha-dat-s', ending: '-ᾳ', case: 'dative', gender: 'feminine', number: 'singular', declension: '1st-alpha', exampleWord: 'ἡμέρᾳ', exampleMeaning: 'to/for day' },
  { id: '1d-alpha-acc-s', ending: '-αν', case: 'accusative', gender: 'feminine', number: 'singular', declension: '1st-alpha', exampleWord: 'ἡμέραν', exampleMeaning: 'day (object)' },
  { id: '1d-alpha-voc-s', ending: '-α', case: 'vocative', gender: 'feminine', number: 'singular', declension: '1st-alpha', exampleWord: 'ἡμέρα', exampleMeaning: 'O day!' },
  // Plural (same as eta pattern)
  { id: '1d-alpha-nom-p', ending: '-αι', case: 'nominative', gender: 'feminine', number: 'plural', declension: '1st-alpha', exampleWord: 'ἡμέραι', exampleMeaning: 'days' },
  { id: '1d-alpha-gen-p', ending: '-ῶν', case: 'genitive', gender: 'feminine', number: 'plural', declension: '1st-alpha', exampleWord: 'ἡμερῶν', exampleMeaning: 'of days' },
  { id: '1d-alpha-dat-p', ending: '-αις', case: 'dative', gender: 'feminine', number: 'plural', declension: '1st-alpha', exampleWord: 'ἡμέραις', exampleMeaning: 'to/for days' },
  { id: '1d-alpha-acc-p', ending: '-ας', case: 'accusative', gender: 'feminine', number: 'plural', declension: '1st-alpha', exampleWord: 'ἡμέρας', exampleMeaning: 'days (object)' },
  { id: '1d-alpha-voc-p', ending: '-αι', case: 'vocative', gender: 'feminine', number: 'plural', declension: '1st-alpha', exampleWord: 'ἡμέραι', exampleMeaning: 'O days!' },
];

// Second Declension - Masculine (ος pattern)
const secondDeclensionMasculine: NounEnding[] = [
  // Singular
  { id: '2d-masc-nom-s', ending: '-ος', case: 'nominative', gender: 'masculine', number: 'singular', declension: '2nd-masc', exampleWord: 'λόγος', exampleMeaning: 'word' },
  { id: '2d-masc-gen-s', ending: '-ου', case: 'genitive', gender: 'masculine', number: 'singular', declension: '2nd-masc', exampleWord: 'λόγου', exampleMeaning: 'of word' },
  { id: '2d-masc-dat-s', ending: '-ῳ', case: 'dative', gender: 'masculine', number: 'singular', declension: '2nd-masc', exampleWord: 'λόγῳ', exampleMeaning: 'to/for word' },
  { id: '2d-masc-acc-s', ending: '-ον', case: 'accusative', gender: 'masculine', number: 'singular', declension: '2nd-masc', exampleWord: 'λόγον', exampleMeaning: 'word (object)' },
  { id: '2d-masc-voc-s', ending: '-ε', case: 'vocative', gender: 'masculine', number: 'singular', declension: '2nd-masc', exampleWord: 'λόγε', exampleMeaning: 'O word!' },
  // Plural
  { id: '2d-masc-nom-p', ending: '-οι', case: 'nominative', gender: 'masculine', number: 'plural', declension: '2nd-masc', exampleWord: 'λόγοι', exampleMeaning: 'words' },
  { id: '2d-masc-gen-p', ending: '-ων', case: 'genitive', gender: 'masculine', number: 'plural', declension: '2nd-masc', exampleWord: 'λόγων', exampleMeaning: 'of words' },
  { id: '2d-masc-dat-p', ending: '-οις', case: 'dative', gender: 'masculine', number: 'plural', declension: '2nd-masc', exampleWord: 'λόγοις', exampleMeaning: 'to/for words' },
  { id: '2d-masc-acc-p', ending: '-ους', case: 'accusative', gender: 'masculine', number: 'plural', declension: '2nd-masc', exampleWord: 'λόγους', exampleMeaning: 'words (object)' },
  { id: '2d-masc-voc-p', ending: '-οι', case: 'vocative', gender: 'masculine', number: 'plural', declension: '2nd-masc', exampleWord: 'λόγοι', exampleMeaning: 'O words!' },
];

// Second Declension - Neuter (ον pattern)
const secondDeclensionNeuter: NounEnding[] = [
  // Singular
  { id: '2d-neut-nom-s', ending: '-ον', case: 'nominative', gender: 'neuter', number: 'singular', declension: '2nd-neut', exampleWord: 'ἔργον', exampleMeaning: 'work' },
  { id: '2d-neut-gen-s', ending: '-ου', case: 'genitive', gender: 'neuter', number: 'singular', declension: '2nd-neut', exampleWord: 'ἔργου', exampleMeaning: 'of work' },
  { id: '2d-neut-dat-s', ending: '-ῳ', case: 'dative', gender: 'neuter', number: 'singular', declension: '2nd-neut', exampleWord: 'ἔργῳ', exampleMeaning: 'to/for work' },
  { id: '2d-neut-acc-s', ending: '-ον', case: 'accusative', gender: 'neuter', number: 'singular', declension: '2nd-neut', exampleWord: 'ἔργον', exampleMeaning: 'work (object)' },
  { id: '2d-neut-voc-s', ending: '-ον', case: 'vocative', gender: 'neuter', number: 'singular', declension: '2nd-neut', exampleWord: 'ἔργον', exampleMeaning: 'O work!' },
  // Plural
  { id: '2d-neut-nom-p', ending: '-α', case: 'nominative', gender: 'neuter', number: 'plural', declension: '2nd-neut', exampleWord: 'ἔργα', exampleMeaning: 'works' },
  { id: '2d-neut-gen-p', ending: '-ων', case: 'genitive', gender: 'neuter', number: 'plural', declension: '2nd-neut', exampleWord: 'ἔργων', exampleMeaning: 'of works' },
  { id: '2d-neut-dat-p', ending: '-οις', case: 'dative', gender: 'neuter', number: 'plural', declension: '2nd-neut', exampleWord: 'ἔργοις', exampleMeaning: 'to/for works' },
  { id: '2d-neut-acc-p', ending: '-α', case: 'accusative', gender: 'neuter', number: 'plural', declension: '2nd-neut', exampleWord: 'ἔργα', exampleMeaning: 'works (object)' },
  { id: '2d-neut-voc-p', ending: '-α', case: 'vocative', gender: 'neuter', number: 'plural', declension: '2nd-neut', exampleWord: 'ἔργα', exampleMeaning: 'O works!' },
];

export const nounEndings: NounEnding[] = [
  ...firstDeclensionEta,
  ...firstDeclensionAlpha,
  ...secondDeclensionMasculine,
  ...secondDeclensionNeuter,
];

export const getNounEndingById = (id: string): NounEnding | undefined => {
  return nounEndings.find(ending => ending.id === id);
};

export const getNounEndingsByDeclension = (declension: string): NounEnding[] => {
  return nounEndings.filter(ending => ending.declension === declension);
};

export const getNounEndingsByCase = (nounCase: string): NounEnding[] => {
  return nounEndings.filter(ending => ending.case === nounCase);
};

export const getUniqueCases = (): string[] => {
  return ['nominative', 'genitive', 'dative', 'accusative', 'vocative'];
};

export const getUniqueGenders = (): string[] => {
  return ['masculine', 'feminine', 'neuter'];
};

export const getUniqueNumbers = (): string[] => {
  return ['singular', 'plural'];
};
