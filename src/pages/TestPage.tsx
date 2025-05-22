import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question, Option, KTTQuestion } from "../types";
import "../styles/TestPage.css";

// Import KTT questions
import kttQuestions from "../../public/att_kafedrasi_ktt_fanidan.json";
import imoQuestions from "../../public/parsed_imo_questions.json";
import mbbdtQuestions from "../../public/mbbdt.json";
import pythonQuestions from "../../public/python.json";

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Function to randomly select a specified number of questions
const getRandomQuestions = <T,>(questions: T[], count: number): T[] => {
  if (!questions || questions.length === 0) return [];
  if (questions.length <= count) return [...questions]; // Return all if fewer than requested

  // Shuffle and take the first 'count' questions
  return shuffleArray(questions).slice(0, count);
};

const TestPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Number of questions to randomly select
  const QUESTIONS_COUNT = 50;

  const questionsObject = useMemo(
    () => ({
      ktt: kttQuestions.questions,
      imo: imoQuestions.questions,
      mbbdt: mbbdtQuestions.questions,
      python: pythonQuestions.questions,
    }),
    []
  );

  useEffect(() => {
    const loadQuestions = () => {
      setIsLoading(true);
      try {
        // KTT subject
        const currentQuestions = questionsObject[
          subjectId as never
        ] as unknown as KTTQuestion[];

        // Format all questions
        const formattedQuestions = currentQuestions?.map((q, index) => ({
          id: index + 1,
          subjectId: 2,
          text: q.question,
          options: shuffleArray(
            q.answers.map((a, i) => ({
              id: i + 1,
              text: a.answer,
              isCorrect: a.isCorrect,
            }))
          ),
        }));

        // Get random questions (up to 50)
        const randomQuestions = getRandomQuestions(
          formattedQuestions,
          QUESTIONS_COUNT
        );
        setQuestions(randomQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [questionsObject, subjectId]);

  // Memoize the current question to prevent unnecessary calculations
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

  // Calculate progress percentage
  const progressPercentage = useMemo(
    () =>
      questions.length > 0
        ? ((currentQuestionIndex + 1) / questions.length) * 100
        : 0,
    [currentQuestionIndex, questions.length]
  );

  // Handler functions with useCallback to prevent unnecessary re-renders
  const handleOptionSelect = useCallback((option: Option) => {
    setSelectedOption(option);
    if (option.isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowResult(true);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Navigate to results page
      navigate(`/`);
    }
  }, [currentQuestionIndex, questions.length, navigate]);

  const getButtonClassName = useCallback(
    (option: Option) => {
      if (!showResult) return "option-button";

      if (option.isCorrect) {
        return "option-button correct";
      }

      if (selectedOption?.id === option.id && !option.isCorrect) {
        return "option-button incorrect";
      }

      return "option-button";
    },
    [showResult, selectedOption]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="test-container">
        <div className="loading-indicator">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  // Handle no questions found
  if (!questions.length) {
    return (
      <div className="test-container">
        <div className="error-message">
          <h2>No questions found</h2>
          <p>Unable to load questions for this subject.</p>
          <button className="primary-button" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Handle current question not found
  if (!currentQuestion) {
    return (
      <div className="test-container">
        <div className="error-message">
          <h2>Question not found</h2>
          <button className="primary-button" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="test-header">
        <div className="question-counter">
          Savollar {currentQuestionIndex + 1}/ {questions.length}
        </div>
        <div className="score-display">Tog'ri javoblar: {score}</div>
      </div>

      <div className="question-card">
        <p className="question-text">{currentQuestion.text}</p>

        <div className="options-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              className={getButtonClassName(option)}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result-section">
            <p
              className={
                selectedOption?.isCorrect ? "correct-text" : "incorrect-text"
              }
            >
              {selectedOption?.isCorrect
                ? "To'g'ri! Yaxshi ishladingiz."
                : "Noto'g'ri. To'g'ri javobni belgilangan."}
            </p>
            <button
              className="next-button"
              onClick={handleNextQuestion}
              autoFocus
            >
              {currentQuestionIndex < questions.length - 1
                ? "Keyingi savol"
                : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
