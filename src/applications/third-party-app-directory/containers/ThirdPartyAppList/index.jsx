// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
// Relative imports.
import { focusElement } from 'platform/utilities/ui';
import SearchResult from '../../components/SearchResult';
import { fetchResultsThunk } from '../../actions';
import { SearchResultPropTypes } from '../../prop-types';

export class ThirdPartyAppList extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    scopes: PropTypes.object.isRequired,
    results: PropTypes.arrayOf(SearchResultPropTypes),
    totalResults: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const justRefreshed = prevProps.fetching && !this.props.fetching;

    if (justRefreshed) {
      focusElement('[data-display-results-header]');
    }
  }

  componentDidMount() {
    this.props.fetchResults();
  }

  render() {
    const { error, fetching, results, scopes } = this.props;

    // Show loading indicator if we are fetching.
    if (fetching) {
      return <va-loading-indicator message="Loading search results..." />;
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <va-alert visible status="error">
          <h3 slot="headline">Something went wrong</h3>
          {error}
        </va-alert>
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

    return (
      <>
        {/* Table of Results */}
        <ul
          className="search-results vads-u-margin-top--2 vads-u-padding--0"
          data-e2e-id="search-results"
        >
          {map(results, result => (
            <SearchResult key={result?.id} item={result} scopes={scopes} />
          ))}
        </ul>
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.thirdPartyAppsReducer.error,
  fetching: state.thirdPartyAppsReducer.fetching,
  results: state.thirdPartyAppsReducer.results,
  scopes: state.thirdPartyAppsReducer.scopes,
  totalResults: state.thirdPartyAppsReducer.totalResults,
});

const mapDispatchToProps = dispatch => ({
  fetchResults: () => fetchResultsThunk()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartyAppList);
