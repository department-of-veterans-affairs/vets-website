import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OfficeList from './OfficeList';

export default function SearchForm({ offices }) {
  const [foundOffices, setFoundOffices] = useState(offices);
  const [filterInputTimeout, setFilterInputTimeout] = useState(null);

  useEffect(
    () => {
      setFoundOffices(offices);
    },
    [offices],
  );

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
          setFoundOffices(results);
        } else {
          // If the text field is empty, show all offices
          setFoundOffices(offices);
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
          placeholder="Filter"
        />
      </div>

      <div className="office-list">
        <OfficeList offices={foundOffices} />
      </div>
    </div>
  );
}

SearchForm.propTypes = {
  offices: PropTypes.array.isRequired,
};
