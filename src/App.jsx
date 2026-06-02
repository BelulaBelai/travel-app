import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Hämtar alla länder från REST Countries API
  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,region,capital,flags"
    )
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.log(error));
  }, []);

  // Filtrerar länder baserat på sökning och vald region
  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesRegion =
      selectedRegion === "All" || country.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const countriesPerPage = 10;

  // Räknar ut vilka länder som ska visas på aktuell sida
  const startIndex = (currentPage - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  return (
    <>
      <h2>Alla länder</h2>

      <label htmlFor="search">Sök efter land</label>
      <input
        id="search"
        type="text"
        value={query}
        // Ny sökning börjar alltid från första sidan
        onChange={(event) => {
          setQuery(event.target.value);
          setCurrentPage(1);
        }}
        placeholder="Sök land..."
      />

      {/* Regionfilter */}
      <div>
        <button
          onClick={() => {
            setSelectedRegion("All");
            setCurrentPage(1);
          }}
        >
          All
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Africa");
            setCurrentPage(1);
          }}
        >
          Africa
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Americas");
            setCurrentPage(1);
          }}
        >
          Americas
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Asia");
            setCurrentPage(1);
          }}
        >
          Asia
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Europe");
            setCurrentPage(1);
          }}
        >
          Europe
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Oceania");
            setCurrentPage(1);
          }}
        >
          Oceania
        </button>

        <button
          onClick={() => {
            setSelectedRegion("Antarctic");
            setCurrentPage(1);
          }}
        >
          Antarctic
        </button>
      </div>

      {paginatedCountries.map((country) => (
        <div key={country.name.common}>
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="100"
          />

          <h3>{country.name.common}</h3>

          <p>Region: {country.region}</p>

          <p>
            Huvudstad: {country.capital ? country.capital[0] : "Saknas"}
          </p>

          <Link to={`/country/${country.name.common}`}>Visa land</Link>

          <hr />
        </div>
      ))}

      
      <nav>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Föregående
        </button>

        <span>
          Sida {currentPage} av {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Nästa
        </button>
      </nav>
    </>
  );
}

function CountryPage() {
  const { name } = useParams();

  const [country, setCountry] = useState(null);

  // Hämtar information om det valda landet
  useEffect(() => {
    fetch(
      `https://restcountries.com/v3.1/name/${name}?fields=name,region,subregion,capital,flags,population,languages,currencies`
    )
      .then((response) => response.json())
      .then((data) => setCountry(data[0]))
      .catch((error) => console.log(error));
  }, [name]);

  if (!country) {
    return <p>Laddar landinformation...</p>;
  }

  return (
    <>
      <h2>{country.name.common}</h2>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      <p>
        <strong>Region:</strong> {country.region}
      </p>

      <p>
        <strong>Subregion:</strong> {country.subregion}
      </p>

      <p>
        <strong>Huvudstad:</strong>{" "}
        {country.capital ? country.capital[0] : "Saknas"}
      </p>

      <p>
        <strong>Befolkning:</strong>{" "}
        {country.population.toLocaleString()}
      </p>

      <p>
  <strong>Språk:</strong>{" "}
  {country.languages
    ? Object.values(country.languages).join(", ")
    : "Saknas"}
</p>

<p>
  <strong>Valuta:</strong>{" "}
  {country.currencies
    ? Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "Saknas"}
</p>

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