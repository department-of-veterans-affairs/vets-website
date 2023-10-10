import React, { useState } from 'react';
// import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SearchControls from '../components/search/SearchControls';
import ResultsList from '../components/search/ResultsList';

export default function Search() {
  const [showResults, setShowResults] = useState(false);

  const handleSearch = e => {
    e.preventDefault();
    setShowResults(!showResults);
  };

  return (
    <>
      <div className="representative-search">
        <div className="title-section">
          <h1>Find a Local Representative</h1>
        </div>

        <SearchControls handleSearch={handleSearch} />
        {showResults && <ResultsList onSelect />}
      </div>
    </>
  );
}
