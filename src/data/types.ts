export type Word = {
  word: string;
  translation: string;
  type: WordType;
};

export type WordType =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "numeral";

export type RandomWord = {
  index: number;
  word: Word;
};

export type QuestionConfig = {
  index: number;
  wordToTranslate: string;
  answer: string;
  options?: string[];
  isManualTranslation: boolean;
};
