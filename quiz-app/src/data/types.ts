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
  | "conjunction";

export type RandomWord = {
  index: number;
  word: Word;
};
