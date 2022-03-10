import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OfficeList from './OfficeList';

export default function SearchForm({ offices }) {
  const allOffices = offices;
  const [foundOffices, setFoundOffices] = useState(allOffices);
  const [filterInputTimeout, setFilterInputTimeout] = useState(null);

  useEffect(
    () => {
      setFoundOffices(allOffices);
    },
    [allOffices],
  );

  // const handleFilter = (e) => {
  //   const keyword = e.target.value;

  //   if (keyword !== '') {
  //     const results = offices.filter((office) => {
  //       return office.title.toLowerCase().includes(keyword.toLowerCase());
  //       // Use the toLowerCase() method to make it case-insensitive
  //     });
  //     setFoundOffices(results);
  //   } else {
  //     setFoundOffices(offices);
  //     // If the text field is empty, show all offices
  //   }

  // };

  const handleFilterChange = e => {
    clearTimeout(filterInputTimeout);
    setFilterInputTimeout(
      setTimeout(() => {
        if (e.target.value !== '') {
          const results = offices.filter(office => {
            return office.title
              .toLowerCase()
              .includes(e.target.value.toLowerCase());
            // Use the toLowerCase() method to make it case-insensitive
          });
          setFoundOffices(results);
        } else {
          setFoundOffices(offices);
          // If the text field is empty, show all offices
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
        {/* {foundOffices && foundOffices.length > 0 ? (
          foundOffices.map((office) => (
          <h3 key={office.entityId}>{office.title}</h3>
          ))
        ) : (
          <h1>No results found!</h1>
        )} */}

        <OfficeList offices={foundOffices} />
      </div>
    </div>
  );
}

SearchForm.propTypes = {
  offices: PropTypes.array.isRequired,
};
