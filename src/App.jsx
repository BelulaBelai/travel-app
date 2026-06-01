import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,region,capital,flags"
    )
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.log(error));
  }, []);

  const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
);

  return (
    <>
      <h2>Alla länder</h2>

      <label htmlFor="search">Sök efter land</label>
<input
  id="search"
  type="text"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Sök land..."
/>

      {filteredCountries.map((country) => (
        <div key={country.name.common}>
          
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="100"
          />

          <h3>{country.name.common}</h3>

          <p>Region: {country.region}</p>

          <p>
            Huvudstad:{" "}
            {country.capital ? country.capital[0] : "Saknas"}
          </p>

          <Link to={`/country/${country.name.common}`}>
            Visa land
          </Link>

          <hr />
        </div>
      ))}
    </>
  );
}

function CountryPage() {
  return (
    <>
      <h2>Detaljsida för land</h2>
      <Link to="/">Tillbaka till startsidan</Link>
    </>
  );
}

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