import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


function CountryPage() {
  const { name } = useParams();

  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [wikiInfo, setWikiInfo] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Hämtar information om det valda landet
  useEffect(() => {
    fetch(
      `https://restcountries.com/v3.1/name/${name}?fields=name,region,subregion,capital,flags,population,languages,currencies,capitalInfo,latlng`
    )
      .then((response) => response.json())
      .then((data) => setCountry(data[0]))
      .catch((error) => console.log(error));
  }, [name]);

  // Hämtar aktuellt väder för landets huvudstad
useEffect(() => {
  if (!country) return;

  const coordinates =
    country.capitalInfo?.latlng || country.latlng;

  if (!coordinates || coordinates.length < 2){
    setWeather(null);
     return;
  }

  const [latitude, longitude] = coordinates;

  if (latitude === undefined || longitude === undefined) {
    setWeather(null);
    return;
  }

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
  )
    .then((response) => response.json())
    .then((data) => setWeather(data))
    .catch((error) => console.log(error));
}, [country]);

// Hämtar kort introduktion från Wikipedia
useEffect(() => {
  if (!country) return;

  fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${country.name.common}`
  )
    .then((response) => response.json())
    .then((data) => setWikiInfo(data))
    .catch((error) => console.log(error));
}, [country]);

// Hämtar bilder från Pexels
useEffect(() => {
  if (!country) return;

  fetch(
    `https://api.pexels.com/v1/search?query=${country.name.common}&per_page=4`,
    {
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => setPhotos(data.photos || []))
    .catch((error) => console.log(error));
}, [country]);


if (!country) {
  return (
    <div className="loading-container">
      <span className="loader"></span>
    </div>
  );
}

return (
  <article className="country-detail">
    <Link className="back-link" to="/">
      ← Back to homepage
    </Link>

    <section className="country-detail-card">
      <img
        className="detail-flag"
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
      />

      <div className="country-detail-info">
        <h2>{country.name.common}</h2>

        <p>
          <strong>Region:</strong> {country.region}
        </p>

        <p>
          <strong>Subregion:</strong> {country.subregion}
        </p>

        <p>
          <strong>Capital city:</strong>{" "}
          {country.capital ? country.capital[0] : "Not available"}
        </p>

        <p>
          <strong>Population:</strong>{" "}
          {country.population > 0
            ? country.population.toLocaleString()
            : "Not available"}
        </p>

        <p>
          <strong>Language:</strong>{" "}
          {country.languages
            ? Object.values(country.languages).join(", ")
            : "Not available"}
        </p>

        <p>
          <strong>Currency:</strong>{" "}
          {country.currencies
            ? Object.values(country.currencies)
                .map((currency) => currency.name)
                .join(", ")
            : "Not available"}
        </p>

        <p>
          <strong>Temperature:</strong>{" "}
          {weather?.current?.temperature_2m !== undefined
            ? `${weather.current.temperature_2m} °C`
            : "Not available"}
        </p>
      </div>
    </section>

    <section className="detail-section">
      <h3>About {country.name.common}</h3>

      {wikiInfo?.extract ? (
        <>
          <p>{wikiInfo.extract}</p>
          <p>
            Source:{" "}
            <a
              href={wikiInfo.content_urls.desktop.page}
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia
            </a>
          </p>
        </>
      ) : (
        <p>No information available.</p>
      )}
    </section>

    <section className="detail-section">
      <h3>Explore {country.name.common}</h3>

      <div className="country-gallery">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.src.medium}
            alt={photo.alt || `Picture from ${country.name.common}`}
          />
        ))}
      </div>
    </section>
  </article>
);
}

export default CountryPage;