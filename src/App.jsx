import { useState } from "react";
import Header from "./components/hearder";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
    </>
  );
}

export default App;
