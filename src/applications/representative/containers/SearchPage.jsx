import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchControls from '../components/search/SearchControls';
import ResultsList from '../components/search/ResultsList';

import {
  clearSearchText,
  clearSearchResults,
  updateSearchQuery,
} from '../actions';

const SearchPage = props => {
  const [showResults, setShowResults] = useState(false);

  const { router } = props;

  const handleSearch = e => {
    e.preventDefault();
    setShowResults(!showResults);
  };

  const handleRedirect = e => {
    e.preventDefault();
    router.replace('form');
  };

  const renderBreadcrumbs = () => {
    return [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/" key="disability">
        Disability
      </a>,
      <a href="/" key="find-an-accredited-representative">
        Find an Accredited Representative
      </a>,
      <a href="/" key="find-a-representative">
        Find a Representative
      </a>,
    ];
  };

  return (
    <>
      <va-breadcrumbs>{renderBreadcrumbs()}</va-breadcrumbs>

      <div className="row">
        <div className="columns search-page-container">
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

          <SearchControls
            currentQuery={props.currentQuery}
            onChange={props.updateSearchQuery}
            onSubmit={handleSearch}
            clearSearchText={props.clearSearchText}
          />

          {showResults && (
            <ResultsList handleRedirect={e => handleRedirect(e)} />
          )}
        </div>
      </div>
    </>
  );
};

SearchPage.propTypes = {
  clearSearchText: PropTypes.func.isRequired,
  currentQuery: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentQuery: state.searchQuery,
  results: state.searchResult.results,
  selectedResult: state.searchResult.selectedResult,
});

const mapDispatchToProps = {
  updateSearchQuery,
  clearSearchResults,
  clearSearchText,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
