import type { GreekLetter } from '../types';

export const greekAlphabet: GreekLetter[] = [
  {
    id: 'alpha',
    uppercase: 'Α',
    lowercase: 'α',
    name: 'Alpha',
    sound: 'ah',
    phoneticGuide: '"ah" as in father'
  },
  {
    id: 'beta',
    uppercase: 'Β',
    lowercase: 'β',
    name: 'Beta',
    sound: 'b',
    phoneticGuide: '"b" as in ball'
  },
  {
    id: 'gamma',
    uppercase: 'Γ',
    lowercase: 'γ',
    name: 'Gamma',
    sound: 'g',
    phoneticGuide: '"g" as in go'
  },
  {
    id: 'delta',
    uppercase: 'Δ',
    lowercase: 'δ',
    name: 'Delta',
    sound: 'd',
    phoneticGuide: '"d" as in dog'
  },
  {
    id: 'epsilon',
    uppercase: 'Ε',
    lowercase: 'ε',
    name: 'Epsilon',
    sound: 'e',
    phoneticGuide: '"e" as in get'
  },
  {
    id: 'zeta',
    uppercase: 'Ζ',
    lowercase: 'ζ',
    name: 'Zeta',
    sound: 'dz',
    phoneticGuide: '"dz" as in adze'
  },
  {
    id: 'eta',
    uppercase: 'Η',
    lowercase: 'η',
    name: 'Eta',
    sound: 'ey',
    phoneticGuide: '"ey" as in obey'
  },
  {
    id: 'theta',
    uppercase: 'Θ',
    lowercase: 'θ',
    name: 'Theta',
    sound: 'th',
    phoneticGuide: '"th" as in think'
  },
  {
    id: 'iota',
    uppercase: 'Ι',
    lowercase: 'ι',
    name: 'Iota',
    sound: 'ee',
    phoneticGuide: '"ee" as in feet'
  },
  {
    id: 'kappa',
    uppercase: 'Κ',
    lowercase: 'κ',
    name: 'Kappa',
    sound: 'k',
    phoneticGuide: '"k" as in kitchen'
  },
  {
    id: 'lambda',
    uppercase: 'Λ',
    lowercase: 'λ',
    name: 'Lambda',
    sound: 'l',
    phoneticGuide: '"l" as in law'
  },
  {
    id: 'mu',
    uppercase: 'Μ',
    lowercase: 'μ',
    name: 'Mu',
    sound: 'm',
    phoneticGuide: '"m" as in mother'
  },
  {
    id: 'nu',
    uppercase: 'Ν',
    lowercase: 'ν',
    name: 'Nu',
    sound: 'n',
    phoneticGuide: '"n" as in new'
  },
  {
    id: 'xi',
    uppercase: 'Ξ',
    lowercase: 'ξ',
    name: 'Xi',
    sound: 'x',
    phoneticGuide: '"x" as in ax'
  },
  {
    id: 'omicron',
    uppercase: 'Ο',
    lowercase: 'ο',
    name: 'Omicron',
    sound: 'o',
    phoneticGuide: '"o" as in not'
  },
  {
    id: 'pi',
    uppercase: 'Π',
    lowercase: 'π',
    name: 'Pi',
    sound: 'p',
    phoneticGuide: '"p" as in peach'
  },
  {
    id: 'rho',
    uppercase: 'Ρ',
    lowercase: 'ρ',
    name: 'Rho',
    sound: 'r',
    phoneticGuide: '"r" as in run (slightly rolled)'
  },
  {
    id: 'sigma',
    uppercase: 'Σ',
    lowercase: 'σ',
    lowercaseFinal: 'ς',
    name: 'Sigma',
    sound: 's',
    phoneticGuide: '"s" as in see'
  },
  {
    id: 'tau',
    uppercase: 'Τ',
    lowercase: 'τ',
    name: 'Tau',
    sound: 't',
    phoneticGuide: '"t" as in table'
  },
  {
    id: 'upsilon',
    uppercase: 'Υ',
    lowercase: 'υ',
    name: 'Upsilon',
    sound: 'oo',
    phoneticGuide: '"oo" as in food'
  },
  {
    id: 'phi',
    uppercase: 'Φ',
    lowercase: 'φ',
    name: 'Phi',
    sound: 'ph',
    phoneticGuide: '"ph" as in phone'
  },
  {
    id: 'chi',
    uppercase: 'Χ',
    lowercase: 'χ',
    name: 'Chi',
    sound: 'ch',
    phoneticGuide: '"ch" as in Bach (guttural)'
  },
  {
    id: 'psi',
    uppercase: 'Ψ',
    lowercase: 'ψ',
    name: 'Psi',
    sound: 'ps',
    phoneticGuide: '"ps" as in lips'
  },
  {
    id: 'omega',
    uppercase: 'Ω',
    lowercase: 'ω',
    name: 'Omega',
    sound: 'oh',
    phoneticGuide: '"oh" as in tone'
  }
];

export const getLetterById = (id: string): GreekLetter | undefined => {
  return greekAlphabet.find(letter => letter.id === id);
};

export const getLetterByName = (name: string): GreekLetter | undefined => {
  return greekAlphabet.find(letter => letter.name.toLowerCase() === name.toLowerCase());
};

export const getAllLetterNames = (): string[] => {
  return greekAlphabet.map(letter => letter.name);
};

export const getAllUppercase = (): string[] => {
  return greekAlphabet.map(letter => letter.uppercase);
};

export const getAllLowercase = (): string[] => {
  return greekAlphabet.map(letter => letter.lowercase);
};
