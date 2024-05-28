import countries from "country-json/src/country-by-flag.json";
import { Country } from "./types";

export function getCountries() {
  const countryArray = countries as Array<{
    country: string;
    flag_base64: string;
  }>;
  const transformedCountries: Country[] = countryArray.map((country) => ({
    name: country.country,
    flag: country.flag_base64,
  }));

  // console.log(
  //   "countries",
  //   transformedCountries.map((c) => c.name)
  // );
  return transformedCountries;
}
