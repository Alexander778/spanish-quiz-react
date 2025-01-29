import { useState } from "react";
import { QuizCard } from "./QuizCard";
import { getTranslationQuestion } from "../helpers/getTranslationQuestion";

export function QuizContainer() {
  const [question, setQuestion] = useState(getTranslationQuestion());

  const onNext = () => {
    setQuestion(getTranslationQuestion());
  };

  return (
    <QuizCard
      wordToTranslate={question.wordToTranslate}
      answer={question.answer}
      isManualTranslation={question.isManualTranslation}
      options={question.isManualTranslation ? undefined : question.options}
      onNext={onNext}
    />
  );
}
