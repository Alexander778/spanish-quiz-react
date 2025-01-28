import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useTranslationQuestion } from "../hooks/useTranslationQuestion";

export function QuizCard() {
  const { wordToTranslate, answer, isManualTranslation, options, onNext } =
    useTranslationQuestion();

  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const onShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div"></Typography>
        <Typography sx={{ color: "text.primary", mb: 1.5 }}>
          {wordToTranslate}
        </Typography>
        <Box>
          {isManualTranslation && !options ? (
            <TextField
              id="outlined-basic"
              variant="outlined"
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <div className="flex flex-col justify-center">
              {options?.map((o) => (
                <Button key={o} variant="contained" onClick={() => onNext(o)}>
                  {o}
                </Button>
              ))}
            </div>
          )}
        </Box>
      </CardContent>
      <CardActions className="flex flex-row justify-center">
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => onNext(inputValue)}
        >
          Submit
        </Button>
        <Button size="small" variant="contained" onClick={onShowAnswer}>
          Answer
        </Button>
        {showAnswer && (
          <Typography sx={{ color: "text.primary", mb: 1.5 }}>
            {answer}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}
