import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  Snackbar,
  SnackbarCloseReason,
  Alert,
} from "@mui/material";
import { useState } from "react";

interface QuizCardProps {
  wordToTranslate: string;
  answer: string;
  options?: string[];
  isManualTranslation: boolean;
  onNext: () => void;
}

export function QuizCard({
  wordToTranslate,
  answer,
  options,
  isManualTranslation,
  onNext,
}: QuizCardProps) {
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onShowAnswer = () => setShowAnswer(!showAnswer);
  const onNextClick = () => {
    if (answer.toLowerCase() === inputValue.toLowerCase()) {
      setInputValue("");
      onNext();
    } else {
      setOpenErrorMsg(true);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: "md" }}>
        <CardContent>
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
          <Box>
            {isManualTranslation ? (
              <TextField
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              options?.map((o) => (
                <Box key={o} className="flex flex-col justify-center m-3">
                  <Button variant="outlined" onClick={onNextClick}>
                    {o}
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
              disabled={!inputValue}
              onClick={onNextClick}
            >
              Submit
            </Button>
          )}
          <Button size="small" variant="contained" onClick={onShowAnswer}>
            Answer
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        color="error"
        open={openErrorMsg}
        autoHideDuration={2000}
        onClose={() => setOpenErrorMsg(false)}
        message="Wrong answer"
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
