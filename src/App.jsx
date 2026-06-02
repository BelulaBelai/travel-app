
import { Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";


function App() {
  return (
    <>
      <header>
        <h1>Reseapp</h1>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/country/:name" element={<CountryPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;