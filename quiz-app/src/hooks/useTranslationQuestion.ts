import { shuffle } from "lodash";
import { words } from "../data/words";
import { Word } from "../data/types";

const REPEAT_MENTIONED_WORDS_POSSIBILITY = 0.1;
const IS_TRANSLATED_WORD_IN_QUESTION_POSSIBILITY = 0.2;
const IS_MANUAL_TRANSLATION_POSSIBILITY = 0.5;
const LOCAL_STORAGE_MENTIONED_WORDS_KEY = "mentionedWords";

export const useTranslationQuestion = () => {
  const randomWordObject = getRandomWord();

  const isManualTranslation = Math.random() < IS_MANUAL_TRANSLATION_POSSIBILITY;
  const isTranslationInTheQuestion =
    Math.random() < IS_TRANSLATED_WORD_IN_QUESTION_POSSIBILITY;

  const wordToTranslate = isTranslationInTheQuestion
    ? randomWordObject.translation
    : randomWordObject.word;

  const answer = isTranslationInTheQuestion
    ? randomWordObject.word
    : randomWordObject.translation;

  const options = isManualTranslation
    ? undefined
    : getAnswerOptions(randomWordObject, answer, isTranslationInTheQuestion);

  const onNext = (inputValue: string) => {
    console.log(inputValue);
    if(answer.toLowerCase() === inputValue.toLowerCase()) {
      console.log('Correct!');
    } else {
        return;
    } 
  };

  return { wordToTranslate, answer, options, isManualTranslation, onNext };
};

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const mentionedWordsFromStorage = localStorage.getItem(
    LOCAL_STORAGE_MENTIONED_WORDS_KEY
  );
  let mentionedWords: number[] = [];

  if (mentionedWordsFromStorage === null) {
    localStorage.setItem(LOCAL_STORAGE_MENTIONED_WORDS_KEY, JSON.stringify([]));
  } else {
    mentionedWords = JSON.parse(mentionedWordsFromStorage);
  }

  if (mentionedWords.includes(randomIndex)) {
    const showSameWordAgain =
      Math.random() < REPEAT_MENTIONED_WORDS_POSSIBILITY;
    if (!showSameWordAgain) {
      return getRandomWord();
    }
  } else {
    mentionedWords.push(randomIndex);
    localStorage.setItem(
      LOCAL_STORAGE_MENTIONED_WORDS_KEY,
      JSON.stringify(mentionedWords)
    );
  }

  return words[randomIndex];
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
