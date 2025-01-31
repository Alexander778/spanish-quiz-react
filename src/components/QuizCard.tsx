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
import {
  getTranslationQuestion,
  setWordToMentioned,
} from "../helpers/getTranslationQuestion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QuestionConfig } from "../data/types";

interface QuizCardProps {
  onNext: () => void;
}

export function QuizCard({ onNext }: QuizCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [question, setQuestion] = useState<QuestionConfig>(
    getTranslationQuestion()
  );
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleShowAnswer = () => setShowAnswer((prev) => !prev);
  const handleSubmit = useCallback(
    (selectedOption?: string) => {
      const userInput = selectedOption
        ? selectedOption.trim()
        : inputValue.trim();

      if (userInput.toLowerCase() === question.answer.trim().toLowerCase()) {
        setOpenErrorMsg(false);
        setShowAnswer(false);
        setWordToMentioned(question.index);
        setQuestion(getTranslationQuestion());
        onNext();
      } else {
        setOpenErrorMsg(true);
      }
      setInputValue("");
    },
    [inputValue, onNext, question]
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!question.isManualTranslation && question.options?.length) {
        const index = Number(e.key) - 1;
        if (index >= 0 && index < question.options.length) {
          handleSubmit(question.options[index]);
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => {
    if (question.isManualTranslation && inputRef.current) {
      inputRef.current.focus();
      // bad code to reset value in the input
      setTimeout(() => {
        setInputValue("");
      }, 1);
    }
  }, [question.isManualTranslation]);

  return (
    <>
      <Card sx={{ maxWidth: "md", minWidth: "md", margin: "auto" }}>
        <CardContent>
          <div className="mb-5">
            <Typography
              sx={{ color: "text.primary", fontWeight: "bold", fontSize: 40 }}
            >
              {question.wordToTranslate}
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
                  {question.answer}
                </Typography>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => navigator.clipboard.writeText(question.answer)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </div>
          <Box>
            {question.isManualTranslation ? (
              <TextField
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
              />
            ) : (
              question.options?.map((option, index) => (
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
          {question.isManualTranslation && (
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
