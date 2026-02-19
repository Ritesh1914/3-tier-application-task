import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then((res) => res.text())
      .then((msg) => setData(msg))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>3-Tier DevOps Project</h1>
      <h2>{data}</h2>
    </div>
  );
}

export default App;

