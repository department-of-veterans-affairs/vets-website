// Node modules.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import map from 'lodash/map';
// Relative imports.
import SearchResult from '../../components/SearchResult';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { fetchResultsThunk } from '../../actions';
import { focusElement } from 'platform/utilities/ui';

export class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        appURL: PropTypes.string.isRequired,
        categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        description: PropTypes.string.isRequired,
        iconURL: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        permissions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        platforms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        privacyPolicyURL: PropTypes.string.isRequired,
        termsOfServiceURL: PropTypes.string.isRequired,
      }).isRequired,
    ),
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalResults: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const justRefreshed = prevProps.fetching && !this.props.fetching;

    if (justRefreshed) {
      focusElement('[data-display-results-header]');
    }
  }

  onPageSelect = page => {
    const { fetchResults, perPage } = this.props;

    // Derive the current name params.
    const queryParams = new URLSearchParams(window.location.search);

    // Derive the state values from our query params.
    const category = queryParams.get('category') || '';
    const platform = queryParams.get('platform') || '';

    // Refetch results.
    fetchResults({
      category,
      platform,
      hideFetchingState: true,
      page,
      perPage,
    });

    // Scroll to top.
    scrollToTop();
  };

  deriveResultsEndNumber = () => {
    const { page, perPage, totalResults } = this.props;

    // Derive the end number.
    const endNumber = page * perPage;

    // If the end number is more than the total results, just show the total results.
    if (endNumber > totalResults) {
      return totalResults;
    }

    // Show the end number.
    return endNumber;
  };

  deriveResultsStartNumber = () => {
    const { page, perPage } = this.props;

    // Derive the end number.
    const endNumber = page * perPage;

    // Derive the start number.
    return endNumber - (perPage - 1);
  };

  render() {
    const {
      deriveResultsEndNumber,
      deriveResultsStartNumber,
      onPageSelect,
    } = this;
    const {
      error,
      fetching,
      page,
      perPage,
      results,
      totalResults,
    } = this.props;

    // Show loading indicator if we are fetching.
    if (fetching) {
      return <LoadingIndicator setFocus message="Loading search results..." />;
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <AlertBox
          headline="Something went wrong"
          content={error}
          status="error"
        />
      );
    }

    // Do not render if we have not fetched, yet.
    if (!results) {
      return null;
    }

    // Show no results found message.
    if (!results.length) {
      return (
        <h2
          className="va-introtext va-u-outline--none vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal"
          data-display-results-header
        >
          No results found.
        </h2>
      );
    }

    // Derive values for "Displayed x-x out of x results."
    const resultsStartNumber = deriveResultsStartNumber();
    const resultsEndNumber = deriveResultsEndNumber();

    return (
      <>
        <h2
          className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--1p5"
          data-display-results-header
        >
          Showing {resultsStartNumber}{' '}
          <span className="vads-u-visibility--screen-reader">through</span>
          <span aria-hidden="true" role="presentation">
            &ndash;
          </span>{' '}
          {resultsEndNumber} of {totalResults} results
        </h2>

        {/* Table of Results */}
        <ul
          className="search-results vads-u-margin-top--2 vads-u-padding--0"
          data-e2e-id="search-results"
        >
          {map(results, result => (
            <SearchResult key={result?.id} item={result} />
          ))}
        </ul>

        {/* Pagination */}
        <Pagination
          className="vads-u-border-top--0"
          onPageSelect={onPageSelect}
          page={page}
          pages={Math.ceil(totalResults / perPage)}
          maxPageListLength={perPage}
          showLastPage
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.thirdPartyAppsReducer.error,
  fetching: state.thirdPartyAppsReducer.fetching,
  results: state.thirdPartyAppsReducer.results,
  page: state.thirdPartyAppsReducer.page,
  perPage: state.thirdPartyAppsReducer.perPage,
  totalResults: state.thirdPartyAppsReducer.totalResults,
});

const mapDispatchToProps = dispatch => ({
  fetchResults: options => fetchResultsThunk(options)(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
