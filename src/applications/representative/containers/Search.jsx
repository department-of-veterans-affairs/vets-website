import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SearchControls from '../components/search/SearchControls';
import ResultsList from '../components/search/ResultsList';

export default function Search({ router }) {
  const [showResults, setShowResults] = useState(false);

  const handleSearch = e => {
    e.preventDefault();
    setShowResults(!showResults);
  };

  const handleRedirect = e => {
    e.preventDefault();
    router.replace('form');
  };

  return (
    <>
      <div className="representative-search">
        <div className="title-section">
          <h1>Find a Local Representative</h1>
        </div>

        <SearchControls handleSearch={handleSearch} />

        {showResults && <ResultsList handleRedirect={e => handleRedirect(e)} />}
      </div>
    </>
  );
}

Search.propTypes = {
  router: PropTypes.object,
};
