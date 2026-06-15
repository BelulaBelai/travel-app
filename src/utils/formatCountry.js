export function formatCountry(country) {
    return {
        name: {
            common: country.names?.common || "Unknown",
        },

        region: country.region || "Not available",
        subregion: country.subregion || "Not available",

        capital: country.capitals
            ? country.capitals.map((capital) => capital.name)
            : null,

        flags: {
            png: country.flag?.url_png,
        },

        population: country.population || 0,

        languages: country.languages
            ? Object.fromEntries(
                country.languages.map((language) => [
                    language.iso639_3 || language.name,
                    language.name,
                ])
            )
            : null,

        currencies: country.currencies
            ? Object.fromEntries(
                country.currencies.map((currency) => [
                    currency.code || currency.name,
                    { name: currency.name },
                ])
            )
            : null,

        capitalInfo: {
            latlng: country.capitals?.[0]?.coordinates
                ? [
                    country.capitals[0].coordinates.lat,
                    country.capitals[0].coordinates.lng,
                ]
                : undefined,
        },

        latlng: country.coordinates
            ? [country.coordinates.lat, country.coordinates.lng]
            : undefined,
    };
}