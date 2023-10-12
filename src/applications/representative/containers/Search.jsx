import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchControls from '../components/search/SearchControls';
import ResultsList from '../components/search/ResultsList';
import Footer from '../components/NeedHelpFooter';

const Search = ({ router }) => {
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
      <div className="vads-l-col--12 small-desktop-screen:vads-l-col--10">
        <div className="title-section">
          <h1>Find an Accredited Representative</h1>
        </div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2 slot="headline">Sign in to see your current representative.</h2>
          <div>
            <button className="usa-button-primary" type="button">
              Sign in
            </button>
          </div>
        </va-alert>

        <SearchControls handleSearch={handleSearch} />

        {showResults && <ResultsList handleRedirect={e => handleRedirect(e)} />}

        <Footer />
      </div>
    </>
  );
};

Search.propTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    selectedResult: state.searchResult.selectedResult,
    searchQuery: state.searchQuery,
    results: state.searchResult.results,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Search);
