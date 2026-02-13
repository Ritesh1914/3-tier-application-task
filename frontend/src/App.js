import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((msg) => setData(msg));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>3-Tier DevOps Project</h1>
      <h2>{data}</h2>
    </div>
  );
}

export default App;
