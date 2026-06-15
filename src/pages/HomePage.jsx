import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatCountry } from "../utils/formatCountry";

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

  Promise.all([
    fetch(
      `https://api.restcountries.com/countries/v5?limit=100&offset=0&api-key=${import.meta.env.VITE_RESTCOUNTRIES_API_KEY}`
    ),
    fetch(
      `https://api.restcountries.com/countries/v5?limit=100&offset=100&api-key=${import.meta.env.VITE_RESTCOUNTRIES_API_KEY}`
    ),
    fetch(
      `https://api.restcountries.com/countries/v5?limit=100&offset=200&api-key=${import.meta.env.VITE_RESTCOUNTRIES_API_KEY}`
    ),
  ])
    .then((responses) => {
      responses.forEach((response) => {
        if (!response.ok) {
          throw new Error("Unable to load countries.");
        }
      });

      return Promise.all(responses.map((response) => response.json()));
    })
    .then((results) => {
      const allCountries = results.flatMap(
        (result) => result.data.objects
      );

      const formattedCountries = allCountries
  .map((country) => formatCountry(country))
  .filter((country) => country.flags.png);

      setCountries(formattedCountries);
    })
    .catch((error) => {
      console.log(error);
      setError("Something went wrong while loading the countries.");
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

  const countriesPerPage = 12;

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
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  );
}

// if (true) {
//   return (
//     <div>
//       <p className="error-message">Testfel</p>
//       <button className="retry-button" onClick={() => window.location.reload()}>
//         Try again
//       </button>
//     </div>
//   );
// }

  return (
    <>

    <section className="home-controls">
      <div className="search-section">
      <label htmlFor="search">Find your dream destination</label>
      <input
        id="search"
        type="text"
        value={query}
        // Ny sökning börjar alltid från första sidan
        onChange={(event) => {
          setQuery(event.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search country..."
      />
      </div>

      {/* Regionfilter */}
      <section className="filter-section" aria-label="Filter countries by region">
        <button
  className={selectedRegion === "All" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("All");
    setCurrentPage(1);
  }}
>
  All
</button>

<button
  className={selectedRegion === "Africa" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Africa");
    setCurrentPage(1);
  }}
>
  Africa
</button>

<button
  className={selectedRegion === "Americas" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Americas");
    setCurrentPage(1);
  }}
>
  Americas
</button>

<button
  className={selectedRegion === "Asia" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Asia");
    setCurrentPage(1);
  }}
>
  Asia
</button>

<button
  className={selectedRegion === "Europe" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Europe");
    setCurrentPage(1);
  }}
>
  Europe
</button>

<button
  className={selectedRegion === "Oceania" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Oceania");
    setCurrentPage(1);
  }}
>
  Oceania
</button>

<button
  className={selectedRegion === "Antarctic" ? "active-region" : ""}
  onClick={() => {
    setSelectedRegion("Antarctic");
    setCurrentPage(1);
  }}
>
  Antarctic
</button>
      </section>
      </section>

        {/* Visas om inga länder matchar sökningen eller regionfiltret */}
{filteredCountries.length === 0 && (
  <p className="no-results"> No countries match your search.</p>
)}

      <ul className="country-list">
  {paginatedCountries.map((country) => (
    <li key={country.name.common} className="country-card">
     {country.flags.png ? (
  <img
    src={country.flags.png}
    alt={`Flag of ${country.name.common}`}
    width="100"
  />
) : (
  <p style={{ color: "red" }}>
    No flag available
  </p>
)}

          <h3>{country.name.common}</h3>

          <p>Region: {country.region}</p>

          <p>
            Capital city: {country.capital ? country.capital[0] : "Not available"}
          </p>

          <Link to={`/country/${country.name.common}`}>Show country</Link>

          </li>
  ))}
</ul>

      
      <nav className="pagination" aria-label="Pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>


        <span>
         Page {filteredCountries.length === 0 ? 0 : currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </nav>
    </>
  );
}

export default HomePage;