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
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { setWordToMentioned } from "../helpers/getTranslationQuestion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleShowAnswer = () => setShowAnswer((prev) => !prev);
  const handleSubmit = useCallback(
    (selectedOption?: string) => {
      setInputValue("");

      const userInput = selectedOption
        ? selectedOption.trim()
        : inputValue.trim();

      if (userInput.toLowerCase() === answer.trim().toLowerCase()) {
        setOpenErrorMsg(false);
        setShowAnswer(false);
        setWordToMentioned(index);
        onNext();
      } else {
        setOpenErrorMsg(true);
      }
    },
    [answer, index, inputValue, onNext]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
    if (event.key === "Control") {
      event.preventDefault();
      handleShowAnswer();
    }
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!isManualTranslation && options?.length) {
        const index = Number(e.key) - 1;
        if (index >= 0 && index < options.length) {
          handleSubmit(options[index]);
        }
      }
    },
    [handleSubmit, isManualTranslation, options]
  );

  useEffect(() => {
    if (isManualTranslation) {
      document.removeEventListener("keydown", handleKeyPress);
    } else {
      document.addEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, isManualTranslation]);

  useEffect(() => {
    if (isManualTranslation && inputRef.current) {
      inputRef.current.focus();
      // bad code to reset value in the input
      setTimeout(() => {
        setInputValue("");
      }, 1);
    }
  }, [isManualTranslation]);

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.primary" }}>
                  {answer}
                </Typography>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => navigator.clipboard.writeText(answer)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </div>
          <Box>
            {isManualTranslation ? (
              <TextField
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
              />
            ) : (
              options?.map((option, index) => (
                <Box key={option} className="flex flex-col justify-center m-3">
                  <Button
                    variant="outlined"
                    onClick={() => handleSubmit(option)}
                  >
                    {index + 1}. {option}
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </CardContent>
        <CardActions className="flex flex-row justify-center">
          {isManualTranslation && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                disabled={!inputValue.trim()}
                onClick={() => handleSubmit()}
              >
                Submit
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={handleShowAnswer}
              >
                Answer
              </Button>
            </>
          )}
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
