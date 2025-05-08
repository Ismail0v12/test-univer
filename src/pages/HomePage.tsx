import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        width: "100%",
        height: "100svh",
      }}
    >
      <Link className="subject-card" to="answers">
        <h2>Javoblar</h2>
      </Link>
      <Link className="subject-card" to="test">
        <h2>Testlar</h2>
      </Link>
    </div>
  );
};

export default HomePage;
