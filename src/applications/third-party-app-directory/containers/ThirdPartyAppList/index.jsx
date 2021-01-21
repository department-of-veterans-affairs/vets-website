// Node modules.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
// Relative imports.
import SearchResult from '../../components/SearchResult';
import { fetchResultsThunk } from '../../actions';
import { focusElement } from 'platform/utilities/ui';
import { SearchResultPropTypes } from '../../prop-types';

export class ThirdPartyAppList extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(SearchResultPropTypes),
    scopes: PropTypes.object.isRequired,
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
      return <LoadingIndicator message="Loading search results..." />;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThirdPartyAppList);
