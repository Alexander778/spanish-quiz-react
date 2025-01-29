import { useState } from "react";
import { QuizCard } from "./QuizCard";
import { getTranslationQuestion } from "../helpers/getTranslationQuestion";
import { Button, Card, CardContent, Typography } from "@mui/material";

export function QuizContainer() {
  const counterFromStorage = localStorage.getItem("counter") || 0;
  const [counter, setCounter] = useState(+counterFromStorage);
  const [question, setQuestion] = useState(getTranslationQuestion());

  const onNext = () => {
    setQuestion(getTranslationQuestion());
    increaseCounter();
  };

  const increaseCounter = () => {
    localStorage.setItem("counter", (counter + 1).toString());
    setCounter((prev) => prev + 1);
  };

  const onReset = () => {
    localStorage.setItem("counter", "0");
    localStorage.setItem("mentionedWords", "[]");
    
    setCounter(0);
  };

  return (
    <>
      <QuizCard
        index={question.index}
        wordToTranslate={question.wordToTranslate}
        answer={question.answer}
        isManualTranslation={question.isManualTranslation}
        options={question.isManualTranslation ? undefined : question.options}
        onNext={onNext}
      />
      <Card className="mt-5">
        <CardContent>
          <Typography variant="h2" align="center">
            {counter}
          </Typography>
          <Button variant="text" onClick={onReset}>Reset counter</Button>
        </CardContent>
      </Card>
    </>
  );
}
