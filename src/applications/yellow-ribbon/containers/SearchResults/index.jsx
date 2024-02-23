// Dependencies.
import React, { Component } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/ui/scrollToTop';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { Toggler } from '@department-of-veterans-affairs/platform-utilities/feature-toggles';
import SearchResult from '../../components/SearchResult';
import { fetchResultsThunk, toggleSearchResultsToolTip } from '../../actions';
import { getYellowRibbonAppState } from '../../helpers/selectors';
import { TOOL_TIP_CONTENT, TOOL_TIP_LABEL } from '../../constants';
import { getCurrentAcademicYear } from '../../helpers';

export class SearchResults extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    isToolTipOpen: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    fetchResultsThunk: PropTypes.func,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        city: PropTypes.string.isRequired,
        contributionAmount: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        insturl: PropTypes.string,
        nameOfInstitution: PropTypes.string.isRequired,
        numberOfStudents: PropTypes.number.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
    ),
    toggleAlertToolTip: PropTypes.func,
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
    const city = queryParams.get('city') || '';
    const contributionAmount = queryParams.get('contributionAmount') || '';
    const name = queryParams.get('name') || '';
    const numberOfStudents = queryParams.get('numberOfStudents') || '';
    const state = queryParams.get('state') || '';

    // Refetch results.
    fetchResults({
      city,
      contributionAmount,
      hideFetchingState: true,
      name,
      numberOfStudents,
      page,
      perPage,
      state,
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

  recordEventOnSearchResultClick = (school = {}) => () => {
    // Derive the current name params.
    const queryParams = new URLSearchParams(window.location.search);

    // Derive the state values from our query params.
    const searchQuery = queryParams.get('name') || '';
    const city = queryParams.get('city') || '';
    const contributionAmount = queryParams.get('contributionAmount') || '';
    const numberOfStudents = queryParams.get('numberOfStudents') || '';
    const stateOrTerritory = queryParams.get('state') || '';

    const { page, perPage, totalResults } = this.props;

    recordEvent({
      event: 'onsite-search-results-click',
      'search-result-type': 'cta',
      'search-filters-list': {
        stateOrTerritory: stateOrTerritory || undefined,
        city: city || undefined,
        contributionAmount: contributionAmount || undefined,
        numberOfStudents: numberOfStudents || undefined,
      },
      'search-results-top-recommendation': undefined,
      'search-selection': 'Yellow Ribbon',
      'search-result-chosen-page-url': school?.insturl || undefined,
      'search-result-chosen-title': school?.nameOfInstitution,
      'search-query': searchQuery,
      'search-results-total-count': totalResults,
      'search-results-total-pages': Math.ceil(totalResults / perPage),
      'search-result-position': school?.positionInResults,
      'search-result-page': page,
      'search-result-chosen-yellow-ribbon-school-attributes': school,
    });
  };

  render() {
    const {
      deriveResultsEndNumber,
      deriveResultsStartNumber,
      onPageSelect,
      recordEventOnSearchResultClick,
    } = this;
    const {
      error,
      fetching,
      isToolTipOpen,
      page,
      perPage,
      results,
      totalResults,
      toggleAlertToolTip,
    } = this.props;

    const academicYear = getCurrentAcademicYear();

    // Show loading indicator if we are fetching.
    if (fetching) {
      return (
        <va-loading-indicator set-focus message="Loading search results..." />
      );
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <va-alert status="error">
          <h3 slot="headline">Something went wrong</h3>
          <div className="usa-alert-text vads-u-font-size--base">{error}</div>
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
        <>
          <h2
            className="va-introtext va-u-outline--none vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal"
            data-display-results-header
          >
            No schools found for your search criteria.
          </h2>
          <va-alert
            onClose={toggleAlertToolTip}
            visible={isToolTipOpen}
            closeable
            status="info"
          >
            <h3 slot="headline">{TOOL_TIP_LABEL}</h3>
            <div className="usa-alert-text vads-u-font-size--base">
              {TOOL_TIP_CONTENT}
            </div>
          </va-alert>
        </>
      );
    }

    // Derive values for "Displayed x-x out of x results."
    const resultsStartNumber = deriveResultsStartNumber();
    const resultsEndNumber = deriveResultsEndNumber();

    return (
      <>
        <h2
          className="va-introtext va-u-outline--none vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal"
          data-display-results-header
          tabIndex="-1"
        >
          {/* eslint-disable-next-line jsx-a11y/aria-role */}
          <span role="text">
            <span>Displaying {resultsStartNumber}</span>
            <span className="vads-u-visibility--screen-reader">through</span>
            <span aria-hidden="true">&ndash;</span>
            <span>
              {resultsEndNumber} of {totalResults} results
            </span>
          </span>
          <Toggler
            toggleName={
              Toggler.TOGGLE_NAMES.yellowRibbonAutomatedDateOnSchoolSearch
            }
          >
            <Toggler.Enabled>
              {/* eslint-disable-next-line jsx-a11y/aria-role */}
              <span role="text">
                <span>Showing {resultsStartNumber}</span>
                <span className="vads-u-visibility--screen-reader">
                  through
                </span>
                <span aria-hidden="true">&ndash;</span>
                <span>
                  {/* eslint-disable-next-line prettier/prettier */}
                  {resultsEndNumber} of {totalResults} schools for academic year {academicYear}.
                </span>
              </span>
            </Toggler.Enabled>
          </Toggler>
        </h2>
        <va-alert
          onClose={toggleAlertToolTip}
          visible={isToolTipOpen}
          closeable
          status="info"
        >
          <h3 slot="headline">{TOOL_TIP_LABEL}</h3>
          <div className="usa-alert-text vads-u-font-size--base">
            {TOOL_TIP_CONTENT}
          </div>
        </va-alert>

        {/* Table of Results */}
        <ul
          className="vads-u-margin-top--2 vads-u-padding--0"
          data-e2e-id="search-results"
        >
          {results?.map((school, index) => (
            <SearchResult
              key={school?.id}
              school={{ ...school, positionInResults: index + 1 }}
              onSearchResultClick={recordEventOnSearchResultClick}
            />
          ))}
        </ul>

        {/* Pagination */}
        <VaPagination
          className="vads-u-border-top--0"
          onPageSelect={e => onPageSelect(e.detail.page)}
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
  error: getYellowRibbonAppState(state).error,
  fetching: getYellowRibbonAppState(state).fetching,
  isToolTipOpen: getYellowRibbonAppState(state).isToolTipOpen,
  results: getYellowRibbonAppState(state).results,
  page: getYellowRibbonAppState(state).page,
  perPage: getYellowRibbonAppState(state).perPage,
  totalResults: getYellowRibbonAppState(state).totalResults,
});

const mapDispatchToProps = dispatch => ({
  fetchResults: options => fetchResultsThunk(options)(dispatch),
  toggleAlertToolTip: () => dispatch(toggleSearchResultsToolTip()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
