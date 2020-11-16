// Node modules.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
// Relative imports.
import SearchResult from '../../components/SearchResult';
import { fetchResultsThunk, fetchScopesThunk } from '../../actions';
import { focusElement } from 'platform/utilities/ui';
import { SearchResultPropTypes } from '../../prop-types';

// TODO: pass fetchScopes method to SearchResult component with category of the result as a param

export class ThirdPartyAppList extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(SearchResultPropTypes),
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
  componentDidMount() {
    this.props.fetchResults({});
  }

  render() {
    const { error, fetching, results } = this.props;

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

    return (
      <>
        <a
          className="usa-button usa-button-primary vads-u-width--auto"
          href="https://www.va.gov/resources/connected-apps-faqs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about connected apps
        </a>
        {/* Table of Results */}
        <ul
          className="search-results vads-u-margin-top--2 vads-u-padding--0"
          data-e2e-id="search-results"
        >
          {map(results, result => (
            <SearchResult key={result?.id} item={result} />
          ))}
        </ul>
        <a
          className="usa-button usa-button-primary vads-u-width--auto"
          href="https://www.va.gov/resources/connected-apps-faqs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about connected apps
        </a>
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
  fetchScopes: category => fetchScopesThunk(category)(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThirdPartyAppList);
