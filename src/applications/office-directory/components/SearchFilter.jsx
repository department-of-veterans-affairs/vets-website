import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OfficeList from './OfficeList';

export default function SearchFilter({ offices }) {
  const [searchResults, setSearchResults] = useState(offices);
  const [filterInputTimeout, setFilterInputTimeout] = useState(null);

  useEffect(() => {
    setSearchResults(offices);
  }, [offices]);

  const handleFilterChange = e => {
    clearTimeout(filterInputTimeout);
    setFilterInputTimeout(
      setTimeout(() => {
        if (e.target.value !== '') {
          const results = offices.filter(office => {
            return office.title
              .toLowerCase()
              .includes(e.target.value.toLowerCase());
          });
          setSearchResults(results);
        } else {
          // If the text field is empty, show all offices
          setSearchResults(offices);
        }
      }, 300),
    );
  };

  return (
    <div className="container">
      <p>Search for an office, organization, department, or program.</p>
      <label htmlFor="query" className="usa-sr-only">
        Search:
      </label>
      <div className="va-flex">
        <input
          type="search"
          onChange={handleFilterChange}
          className="input"
          id="query"
          placeholder="Filter"
        />
      </div>

      <div className="office-list">
        <OfficeList offices={searchResults} />
      </div>
    </div>
  );
}

SearchFilter.propTypes = {
  offices: PropTypes.array.isRequired,
};
