import { useState } from "react";
import { QuizCard } from "./QuizCard";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export function QuizContainer() {
  const counterFromStorage = localStorage.getItem("counter") || 0;
  const [counter, setCounter] = useState(+counterFromStorage);

  const onNext = () => {
    localStorage.setItem("counter", (counter + 1).toString());
    const counterFromStorage = localStorage.getItem("counter") || 0;

    setCounter(+counterFromStorage);
  };

  const onReset = () => {
    localStorage.setItem("counter", "0");
    localStorage.setItem("mentionedWords", "[]");
    
    setCounter(0);
  };

  return (
    <>
      <QuizCard onNext={onNext} />
      <Card className="mt-8 max-h-30">
        <CardContent className="flex flex-row justify-around items-center">
          <Typography variant="h2" align="center">
            {counter}
          </Typography>
          <IconButton color="primary" onClick={onReset}>
            <RestartAltIcon />
          </IconButton>
        </CardContent>
      </Card>
    </>
  );
}
