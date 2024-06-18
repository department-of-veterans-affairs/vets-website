/* eslint-disable react/sort-prop-types */
/* eslint-disable react/static-property-placement */
// Dependencies.
import React, { Component } from 'react';
import {
  VaAlert,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import SearchResult from '../../components/SearchResult';
import { fetchResultsThunk, toggleSearchResultsToolTip } from '../../actions';
import { getYellowRibbonAppState } from '../../helpers/selectors';
import {
  CONTRIBUTION_AMOUNT_SUMMARY_TEXT,
  NUMBER_OF_STUDENTS_SUMMARY_TEXT,
  TOOL_TIP_CONTENT,
  TOOL_TIP_LABEL,
} from '../../constants';
import { getCurrentAcademicYear, titleCase } from '../../helpers';

export class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    isToolTipOpen: PropTypes.bool.isRequired,
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
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalResults: PropTypes.number,
    // mapDispatchToProps
    toggleAlertToolTip: PropTypes.func,
    fetchResultsThunk: PropTypes.func,
  };

  componentDidUpdate(prevProps) {
    const justRefreshed = prevProps.fetching && !this.props.fetching;

    if (justRefreshed) {
      focusElement('[data-display-results-header]');
    }
  }

  getSearchParams = (searchString = window.location.search) => {
    // Derive the current name params.
    const queryParams = new URLSearchParams(searchString);

    // Derive and return the state values from our query params.
    return {
      name: queryParams.get('name') || '',
      stateOrTerritory: queryParams.get('state') || '',
      city: queryParams.get('city') || '',
      contributionAmount: queryParams.get('contributionAmount') || '',
      numberOfStudents: queryParams.get('numberOfStudents') || '',
    };
  };

  deriveAdditionalParamsString = () => {
    const {
      name,
      stateOrTerritory,
      city,
      contributionAmount,
      numberOfStudents,
    } = this.getSearchParams();

    const searchParams = [
      { key: 'name', value: name, transform: val => titleCase(val) },
      { key: 'city', value: city, transform: val => titleCase(val) },
      { key: 'stateOrTerritory', value: stateOrTerritory },
      {
        key: 'contributionAmount',
        value: contributionAmount,
        text: CONTRIBUTION_AMOUNT_SUMMARY_TEXT,
      },
      {
        key: 'numberOfStudents',
        value: numberOfStudents,
        text: NUMBER_OF_STUDENTS_SUMMARY_TEXT,
      },
    ];

    const additionalSearchParams = searchParams.reduce(
      (acc, { key, value, transform, text }) => {
        if (value) {
          const formattedValue = transform ? transform(value) : value;
          const displayText = text || `"${formattedValue}"`;
          acc.push(<strong key={key}>{displayText}</strong>);
        }
        return acc;
      },
      [],
    );

    // Combine elements with commas
    const additionalParamsJsx = additionalSearchParams.reduce(
      (prev, curr, index) => [
        ...prev,
        index > 0 ? ', ' : '', // Add comma separator if not the first element
        curr,
      ],
      [],
    );

    if (additionalParamsJsx.length > 0) {
      return <>: {additionalParamsJsx}</>;
    }

    return null;
  };

  onPageSelect = page => {
    // eslint-disable-next-line react/prop-types
    const { fetchResults, perPage } = this.props;

    const {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      stateOrTerritory,
    } = this.getSearchParams();

    // Refetch results.
    fetchResults({
      city,
      contributionAmount,
      hideFetchingState: true,
      name,
      numberOfStudents,
      page,
      perPage,
      state: stateOrTerritory,
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
    const {
      name,
      city,
      contributionAmount,
      numberOfStudents,
      stateOrTerritory,
    } = this.getSearchParams();

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
      'search-query': name,
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

    // Show loading indicator if we are fetching.
    if (fetching) {
      return (
        <va-loading-indicator set-focus message="Loading search results..." />
      );
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <VaAlert status="error">
          <h3 slot="headline">Something went wrong</h3>
          <div className="usa-alert-text vads-u-font-size--base">{error}</div>
        </VaAlert>
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
          <VaAlert
            closeBtnAriaLabel="Close notification"
            onCloseEvent={toggleAlertToolTip}
            visible={isToolTipOpen}
            closeable
            status="info"
          >
            <h3 slot="headline">{TOOL_TIP_LABEL}</h3>
            <div className="usa-alert-text vads-u-font-size--base">
              {TOOL_TIP_CONTENT}
            </div>
          </VaAlert>
        </>
      );
    }

    const resultsStartNumber = deriveResultsStartNumber();
    const resultsEndNumber = deriveResultsEndNumber();
    const academicYear = getCurrentAcademicYear();
    const additionalParamsString = this.deriveAdditionalParamsString();

    return (
      <>
        <h2
          className="va-introtext va-u-outline--none vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal"
          data-display-results-header
          tabIndex="-1"
        >
          <span role="text">
            <span>Showing {resultsStartNumber}</span>
            <span className="vads-u-visibility--screen-reader">through</span>
            <span aria-hidden="true">&ndash;</span>
            <span>
              {resultsEndNumber} of {totalResults} schools for academic year{' '}
              {academicYear}
              {additionalParamsString}.
            </span>
          </span>
        </h2>
        <VaAlert
          closeBtnAriaLabel="Close notification"
          onCloseEvent={toggleAlertToolTip}
          visible={isToolTipOpen}
          closeable
          status="info"
        >
          <h3 slot="headline">{TOOL_TIP_LABEL}</h3>
          <div className="usa-alert-text vads-u-font-size--base">
            {TOOL_TIP_CONTENT}
          </div>
        </VaAlert>

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
