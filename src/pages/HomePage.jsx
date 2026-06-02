import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedRegion, setSelectedRegion] = useState(
  searchParams.get("region") || "All"
);
  const [currentPage, setCurrentPage] = useState(
  Number(searchParams.get("page")) || 1
);
 

  // Hämtar alla länder från REST Countries API
useEffect(() => {
  setLoading(true);
  setError(null);

  fetch(
    "https://restcountries.com/v3.1/all?fields=name,region,capital,flags"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kunde inte hämta länder");
      }

      return response.json();
    })
    .then((data) => setCountries(data))
    .catch((error) => {
      console.log(error);
      setError("Något gick fel när länderna skulle hämtas.");
    })
    .finally(() => setLoading(false));
}, []);

// Uppdaterar URL-parametrar när sökning, region eller sida ändras
useEffect(() => {
  const params = {};

  if (query) params.query = query;
  if (selectedRegion !== "All") params.region = selectedRegion;
  if (currentPage !== 1) params.page = currentPage.toString();

  setSearchParams(params);
}, [query, selectedRegion, currentPage, setSearchParams]);

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

  if (loading) {
  return (
    <div className="loading-container">
      <span className="loader"></span>
    </div>
  );
}

if (error) {
  return (
    <div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        Försök igen
      </button>
    </div>
  );
}

// if (true) {
//   return (
//     <div>
//       <p>Testfel</p>
//       <button onClick={() => window.location.reload()}>
//         Försök igen
//       </button>
//     </div>
//   );
// }

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

        {/* Visas om inga länder matchar sökningen eller regionfiltret */}
{filteredCountries.length === 0 && (
  <p>Inga länder matchar dina kriterier.</p>
)}

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

export default HomePage;