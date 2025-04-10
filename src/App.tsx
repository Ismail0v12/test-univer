import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubjectsPage from "./pages/SubjectsPage";
import TestPage from "./pages/TestPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SubjectsPage />} />
          <Route path="/test/:subjectId" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}
    
export default App;
