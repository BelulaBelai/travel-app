import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


function CountryPage() {
  const { name } = useParams();

  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [wikiInfo, setWikiInfo] = useState(null);

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

  if (!country) {
  return (
    <div className="loading-container">
      <span className="loader"></span>
    </div>
  );
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
        {country.population > 0 ? country.population.toLocaleString() : "Befolkningsdata saknas"}
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

<p>
  <strong>Temperatur:</strong>{" "}
  {weather?.current?.temperature_2m !== undefined
    ? `${weather.current.temperature_2m} °C`
    : "Väderdata saknas"}
</p>

<section>
  <h3>Kort introduktion</h3>

  {wikiInfo?.extract ? (
    <>
      <p>{wikiInfo.extract}</p>
      <p>
        Källa:{" "}
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
    <p>Ingen introduktion hittades.</p>
  )}
</section>

      <Link to="/">Tillbaka till startsidan</Link>
    </>
  );
}

export default CountryPage;