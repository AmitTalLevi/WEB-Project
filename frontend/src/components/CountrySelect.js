import React from 'react';

const countries = [
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Colombia", "Costa Rica", "Croatia", 
  "Cuba", "Czechia (Czech Republic)", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Finland", "France", 
  "Germany", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
  "Kenya", "Latvia", "Lithuania", "Malaysia", "Mexico", "Monaco", "Morocco", "Netherlands", "New Zealand", "Norway", 
  "Panama", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", "Slovakia", 
  "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", 
  "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Venezuela", "Vietnam", "Zimbabwe"
];

// Group countries by their first letter
const groupedCountries = countries.reduce((grouped, country) => {
  const letter = country[0].toUpperCase();
  if (!grouped[letter]) {
    grouped[letter] = [];
  }
  grouped[letter].push(country);
  return grouped;
}, {});

const CountrySelect = ({ value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Select a country</option>
      {Object.keys(groupedCountries)
        .sort()
        .map(letter => (
            <optgroup key={letter} label={letter}>
              {groupedCountries[letter].map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </optgroup>
        ))}
    </select>
  );
};

export default CountrySelect;
