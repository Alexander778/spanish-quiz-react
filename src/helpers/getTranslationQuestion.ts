import { shuffle } from "lodash";
import { words } from "../data/words";
import { QuestionConfig, RandomWord, Word } from "../data/types";
import {
  IS_MANUAL_TRANSLATION_POSSIBILITY,
  IS_TRANSLATED_WORD_IN_QUESTION_POSSIBILITY,
  LOCAL_STORAGE_MENTIONED_WORDS_KEY,
  REPEAT_MENTIONED_WORDS_POSSIBILITY,
} from "../constants/constants";

export const getTranslationQuestion = (): QuestionConfig => {
  const randomWordObject = getRandomWord();

  const wordIndex = randomWordObject.index;
  const randomWord = randomWordObject.word;

  const isManualTranslation = Math.random() < IS_MANUAL_TRANSLATION_POSSIBILITY;
  const isTranslationInTheQuestion =
    Math.random() < IS_TRANSLATED_WORD_IN_QUESTION_POSSIBILITY;

  const wordToTranslate = isTranslationInTheQuestion
    ? randomWord.translation
    : randomWord.word;

  const answer = isTranslationInTheQuestion
    ? randomWord.word
    : randomWord.translation;

  const options = isManualTranslation
    ? undefined
    : getAnswerOptions(randomWord, answer, isTranslationInTheQuestion);

  return {
    index: wordIndex,
    wordToTranslate,
    answer,
    options,
    isManualTranslation,
  };
};

export function setWordToMentioned(index: number) {
  const mentionedWords = readMentionedWordsFromStorage();

  mentionedWords.push(index);

  localStorage.setItem(
    LOCAL_STORAGE_MENTIONED_WORDS_KEY,
    JSON.stringify(mentionedWords)
  );
}

function getRandomWord(): RandomWord {
  const randomIndex = Math.floor(Math.random() * words.length);
  const mentionedWords = readMentionedWordsFromStorage();

  if (mentionedWords.includes(randomIndex)) {
    const showSameWordAgain =
      Math.random() < REPEAT_MENTIONED_WORDS_POSSIBILITY;
    if (!showSameWordAgain) {
      return getRandomWord();
    }
  }

  return { index: randomIndex, word: words[randomIndex] };
}

function getAnswerOptions(
  randomWordObject: Word,
  answer: string,
  isTranslationInTheQuestion: boolean
) {
  const options = [
    isTranslationInTheQuestion
      ? randomWordObject.word
      : randomWordObject.translation,
  ];
  const sameTypeWords = words.filter(
    (word) => word.word !== answer && word.type === randomWordObject.type
  );

  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * sameTypeWords.length);
    const randomWord = sameTypeWords.splice(randomIndex, 1)[0];
    options.push(
      isTranslationInTheQuestion ? randomWord.word : randomWord.translation
    );
  }

  return shuffle(options);
}

function readMentionedWordsFromStorage() {
  const mentionedWordsFromStorage = localStorage.getItem(
    LOCAL_STORAGE_MENTIONED_WORDS_KEY
  );

  let mentionedWords: number[] = [];
  if (mentionedWordsFromStorage === null) {
    localStorage.setItem(LOCAL_STORAGE_MENTIONED_WORDS_KEY, JSON.stringify([]));
  } else {
    mentionedWords = JSON.parse(mentionedWordsFromStorage);
  }

  return mentionedWords;
}
