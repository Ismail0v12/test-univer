import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TestPage.css";

// Import KTT questions
import kttQuestions from "../../public/att_kafedrasi_ktt_fanidan.json";
import imoQuestions from "../../public/parsed_imo_questions.json";
import mbbdtQuestions from "../../public/mbbdt.json";
import pythonQuestions from "../../public/python.json";

const TestPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const object = subjectId as "ktt" | "imo" | "mbbdt" | "python";
  const [query, setQuery] = useState("");
  const questionsObject = useMemo(
    () => ({
      ktt: kttQuestions.questions,
      imo: imoQuestions.questions,
      mbbdt: mbbdtQuestions.questions,
      python: pythonQuestions.questions,
    }),
    []
  );

  const currentObect = questionsObject[object];

  const renderObjects = useMemo(() => {
    if (query.length === 0) {
      return currentObect;
    }
    return currentObect.filter((item) =>
      item.question.toLowerCase().includes(query)
    );
  }, [currentObect, query]);

  // Handle no questions found
  if (!currentObect.length) {
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

  return (
    <div className="test-container">
      <div className="test-header">
        <div className="question-counter">Savollar {currentObect.length}</div>
      </div>

      <div
        className="search"
        style={{
          margin: "16px 0",
        }}
      >
        <input
          value={query}
          className="option-button"
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>

      <div className="question-card">
        <div className="options-grid">
          {renderObjects.map((option) => (
            <>
              <p className="question-text">{option.question}</p>

              {option.answers.map((item) => (
                <button
                  key={item.answer}
                  className={
                    item.isCorrect ? "option-button correct" : "option-button"
                  }
                >
                  {item.answer}
                </button>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
