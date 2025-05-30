import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Subject } from "../types";
import "../styles/SubjectsPage.css";

// Mock data - in real application this would come from an API
const mockSubjects: Subject[] = [
  {
    id: "python",
    name: "Python",
    description: "Test your knowledge in basic python",
  },
  {
    id: "ktt",
    name: "KTT",
    description:
      "Test your knowledge in Computer Networks and Telecommunications",
  },
  {
    id: "imo",
    name: "IMO",
    description: "Test your programming skills",
  },
  {
    id: "mbbdt",
    name: "MBBT",
    description: "Test your programming skills",
  },
];

const SubjectsPage = () => {
  const [subjects] = useState<Subject[]>(mockSubjects);
  const location = useLocation();

  return (
    <div className="subjects-container">
      <h1>Choose a Subject</h1>
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <Link
            to={
              location.pathname.includes("base")
                ? `base_${subject.id}`
                : subject.id
            }
            key={subject.id}
            className="subject-card"
          >
            <h2>{subject.name}</h2>
            <p>{subject.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
