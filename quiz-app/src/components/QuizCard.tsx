import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { setWordToMentioned } from "../helpers/getTranslationQuestion";

interface QuizCardProps {
  index: number;
  wordToTranslate: string;
  answer: string;
  options?: string[];
  isManualTranslation: boolean;
  onNext: () => void;
}

export function QuizCard({
  index,
  wordToTranslate,
  answer,
  options,
  isManualTranslation,
  onNext,
}: QuizCardProps) {
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleShowAnswer = () => setShowAnswer((prev) => !prev);
  const handleSubmit = (selectedOption?: string) => {
    const userInput = selectedOption
      ? selectedOption.trim()
      : inputValue.trim();

    if (userInput.toLowerCase() === answer.trim().toLowerCase()) {
      setInputValue("");
      setOpenErrorMsg(false);
      setShowAnswer(false);
      setWordToMentioned(index);
      onNext();
    } else {
      setOpenErrorMsg(true);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: "md", minWidth: "md", margin: "auto" }}>
        <CardContent>
          <div className="mb-5">
            <Typography
              sx={{ color: "text.primary", fontWeight: "bold", fontSize: 40 }}
            >
              {wordToTranslate}
            </Typography>
            {showAnswer && (
              <Typography sx={{ color: "text.primary", mb: 1.5 }}>
                {answer}
              </Typography>
            )}
          </div>
          <Box>
            {isManualTranslation ? (
              <TextField
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              options?.map((option) => (
                <Box key={option} className="flex flex-col justify-center m-3">
                  <Button
                    variant="outlined"
                    onClick={() => handleSubmit(option)}
                  >
                    {option}
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </CardContent>
        <CardActions className="flex flex-row justify-center">
          {isManualTranslation && (
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={!inputValue.trim()}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          )}
          <Button size="small" variant="contained" onClick={handleShowAnswer}>
            Answer
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openErrorMsg}
        autoHideDuration={2000}
        onClose={() => setOpenErrorMsg(false)}
      >
        <Alert
          onClose={() => setOpenErrorMsg(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Wrong answer
        </Alert>
      </Snackbar>
    </>
  );
}
