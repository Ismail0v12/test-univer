import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubjectsPage from "./pages/SubjectsPage";
import TestPage from "./pages/TestPage";
import HomePage from "./pages/HomePage";
import AnswersPage from "./pages/AnswersPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<SubjectsPage />} />
          <Route path="/test/:subjectId" element={<TestPage />} />
          <Route path="/answers" element={<SubjectsPage />} />
          <Route path="/answers/:subjectId" element={<AnswersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
