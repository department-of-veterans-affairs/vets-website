/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useStore } from 'react-redux';
import {
  VaBreadcrumbs,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { isEmpty } from 'lodash';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import repStatusLoader from 'platform/user/widgets/representative-status';
import { recordSearchResultsChange } from '../utils/analytics';
import SearchControls from '../components/search/SearchControls';
import SearchResultsHeader from '../components/results/SearchResultsHeader';
import ResultsList from '../components/results/ResultsList';
import PaginationWrapper from '../components/results/PaginationWrapper';
import GetFormHelp from '../components/footer/GetFormHelp';
import { ErrorTypes } from '../constants';

import {
  clearSearchText,
  clearSearchResults,
  fetchRepresentatives,
  searchWithInput,
  updateSearchQuery,
  commitSearchQuery,
  geolocateUser,
  geocodeUserAddress,
  submitRepresentativeReport,
  initializeRepresentativeReport,
  cancelRepresentativeReport,
  updateFromLocalStorage,
  clearError,
} from '../actions';

const SearchPage = props => {
  const searchResultTitleRef = useRef(null);
  const previousLocationInputString = useRef(
    props.currentQuery.locationInputString,
  );
  const previousSortType = useRef(props.currentQuery.sortType);
  const previousRepresentativeType = useRef(
    props.currentQuery.representativeType,
  );
  const previousRepresentativeInputString = useRef(
    props.currentQuery.representativeInputString,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplayingResults, setIsDisplayingResults] = useState(false);

  const isPostLogin = props.location?.search?.includes('postLogin=true');

  const resultsArePresent =
    (props.location?.search && props?.results?.length > 0) ||
    isEmpty(props.location.query);

  const store = useStore();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const widgetEnabled = useToggleValue(
    TOGGLE_NAMES.representativeStatusEnabled,
  );

  const updateUrlParams = params => {
    const { location, currentQuery } = props;

    const queryParams = {
      address: currentQuery.locationInputString,
      lat: currentQuery.position?.latitude,
      long: currentQuery.position?.longitude,
      page: currentQuery.page || 1,
      perPage: 10,
      sort: currentQuery.sortType?.toLowerCase(),
      type: currentQuery.representativeType,
      name: currentQuery.representativeInputString,
      ...params,
    };

    if (currentQuery.committedSearchQuery.searchArea !== null) {
      queryParams.distance = currentQuery.committedSearchQuery.searchArea;
    }

    const queryStringObj = appendQuery(
      `/get-help-from-accredited-representative/find-rep${location.pathname}`,
      queryParams,
    );
    browserHistory.push(queryStringObj);
  };

  const handleSearch = async () => {
    clearError(ErrorTypes.geocodeError);
    setIsSearching(true);
    props.geocodeUserAddress(props.currentQuery);
    // search query committed in geocodeUserAddress function
  };

  const handleSearchViaUrl = () => {
    const { location } = props;

    if (resultsArePresent || isPostLogin) {
      return;
    }

    setIsSearching(true);

    const queryUpdateCommitPayload = {
      id: Date.now(),
      context: {
        location: location.query.address,
        repOrgName: location.query.name,
      },
      locationQueryString: location.query.address,
      locationInputString: location.query.address,
      position: {
        latitude: location.query.lat,
        longitude: location.query.long,
      },
      representativeQueryString: location.query.name,
      representativeInputString: location.query.name,
      representativeType: location.query.type,
      page: location.query.page,
      sortType: location.query.sort,
      searchArea: location.query.distance,
    };

    props.updateSearchQuery(queryUpdateCommitPayload);
    props.commitSearchQuery(queryUpdateCommitPayload);
  };

  const handleSearchOnQueryChange = () => {
    const { currentQuery, searchResults } = props;
    const {
      context,
      representativeInputString,
      representativeType,
      position,
      sortType,
      page,
      searchArea,
    } = currentQuery.committedSearchQuery;

    const { latitude, longitude } = position;

    setIsSearching(true);

    const distance = searchArea === 'Show all' ? null : searchArea;

    updateUrlParams({
      address: context.location,
      name: representativeInputString || null,
      lat: latitude,
      long: longitude,
      type: representativeType,
      page: page || 1,
      sort: sortType,
      distance,
    });

    const conditionalDataLayerPush = () => {
      return (
        currentLocationInputString,
        currentSortType,
        currentRepresentativeType,
        currentRepresentativeInputString,
      ) => {
        const dataLayerProps = {
          locationInputString: context.location,
          representativeType,
          searchRadius: distance,
          representativeName: representativeInputString,
          sortType,
          totalCount: searchResults?.meta?.totalEntries,
          totalPages: searchResults?.meta?.totalPages,
          currentPage: searchResults?.meta?.currentPage,
        };

        const locationUpdated =
          currentLocationInputString !== previousLocationInputString.current;

        const sortTypeUpdated = currentSortType !== previousSortType.current;

        const repTypeUpdated =
          currentRepresentativeType !== previousRepresentativeType.current;

        const repNameUpdated =
          currentRepresentativeInputString !==
          previousRepresentativeInputString.current;

        if (locationUpdated) {
          recordSearchResultsChange(dataLayerProps, 'location');
          previousLocationInputString.current = currentLocationInputString;
          return;
        }

        if (sortTypeUpdated) {
          recordSearchResultsChange(dataLayerProps, 'sort', sortType);
          previousSortType.current = currentSortType;
        }

        if (repTypeUpdated) {
          recordSearchResultsChange(
            dataLayerProps,
            'filter',
            representativeType,
          );
          previousRepresentativeType.current = currentRepresentativeType;
        }
        if (repNameUpdated) {
          recordSearchResultsChange(
            dataLayerProps,
            'filter',
            representativeInputString,
          );
          previousRepresentativeInputString.current = currentRepresentativeInputString;
        }
      };
    };

    if (!props.searchWithInputInProgress) {
      const execute = conditionalDataLayerPush();

      execute(
        context.location,
        sortType,
        representativeType,
        representativeInputString,
      );

      props.searchWithInput({
        address: context.location,
        lat: latitude,
        long: longitude,
        name: representativeInputString,
        page,
        perPage: 10,
        sort: sortType,
        type: representativeType,
        distance,
      });

      setIsSearching(false);
      setIsLoading(true);
      setIsDisplayingResults(false);
    }
  };

  const handlePageSelect = e => {
    const { page } = e.detail;
    setIsSearching(true);

    const queryUpdateCommitPayload = {
      id: Date.now(),
      page,
    };

    props.updateSearchQuery(queryUpdateCommitPayload);
    props.commitSearchQuery(queryUpdateCommitPayload);
  };

  // Trigger request on query update following search
  useEffect(
    () => {
      if (isSearching && !props.errors.isErrorGeocode) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.committedSearchQuery.id],
  );

  // Trigger request on sort update
  useEffect(
    () => {
      if (props.currentQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.committedSearchQuery.sortType],
  );

  // Trigger request on page update
  useEffect(
    () => {
      if (props.currentQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.committedSearchQuery.page],
  );

  useEffect(
    () => {
      if (isSearching && props.errors.isErrorGeocode) {
        setIsSearching(false);
      }
    },
    [props.errors.isErrorGeocode],
  );

  // search complete
  useEffect(
    () => {
      if (props.currentQuery.searchCounter > 0) {
        setIsSearching(false);
        setIsLoading(false);
        setIsDisplayingResults(true);
      }
    },
    [props.currentQuery.searchCounter],
  );

  // jump to results
  useEffect(
    () => {
      if (isDisplayingResults) {
        window.scrollTo(0, 600);
        focusElement('#search-results-subheader');
      }
    },
    [isDisplayingResults],
  );

  // search from query params on page load
  useEffect(() => {
    handleSearchViaUrl();
    repStatusLoader(store, 'representative-status', 3);
  }, []);

  const renderBreadcrumbs = () => {
    const breadcrumbs = [
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/get-help-from-accredited-representative',
        label: 'Get help from a VA accredited representative or VSO',
      },
      {
        href: '/get-help-from-accredited-representative/find-rep',
        label: 'Find a VA accredited representative or VSO',
      },
    ];
    return (
      <>
        <VaBreadcrumbs breadcrumbList={breadcrumbs} uswds />
      </>
    );
  };

  const renderSearchSection = () => {
    return (
      <div className="row search-section">
        <div className="title-section">
          <h1>Find a VA accredited representative or VSO</h1>
          <p>
            An accredited attorney, claims agent, or Veterans Service
            Organization (VSO) representative can help you file a claim or
            request a decision review. Use our search tool to find one of these
            types of accredited representatives to help you.
          </p>
          <p>
            <strong>Note:</strong> You’ll need to contact the accredited
            representative you’d like to appoint to make sure they’re available
            to help you.
          </p>
        </div>

        {widgetEnabled && (
          <>
            <div tabIndex="-1">
              <div data-widget-type="representative-status" />
            </div>
          </>
        )}

        <SearchControls
          geolocateUser={props.geolocateUser}
          currentQuery={props.currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          clearSearchText={props.clearSearchText}
          geocodeError={props.errors.isErrorGeocode}
          clearError={props.clearError}
        />

        {props.isErrorFetchRepresentatives && (
          <div className="vads-u-margin-y--3">
            <va-alert
              close-btn-aria-label="Close notification"
              status="error"
              uswds
              visible
            >
              <h2 slot="headline">We’re sorry, something went wrong</h2>
              <React.Fragment key=".1">
                <p className="vads-u-margin-y--0">Please try again soon.</p>
              </React.Fragment>
            </va-alert>
          </div>
        )}
      </div>
    );
  };

  const renderResultsSection = () => {
    const {
      currentQuery,
      searchResults,
      pagination,
      isErrorFetchRepresentatives,
    } = props;

    const paginationWrapper = () => {
      const currentPage = pagination ? pagination.currentPage : 1;
      const totalPages = pagination ? pagination.totalPages : 1;

      return (
        <PaginationWrapper
          handlePageSelect={handlePageSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          searchResults={searchResults}
          inProgress={currentQuery.inProgress}
        />
      );
    };

    const resultsList = () => {
      return (
        <ResultsList
          query={currentQuery}
          inProgress={currentQuery.inProgress}
          searchResults={searchResults}
          sortType={currentQuery.sortType}
          submitRepresentativeReport={props.submitRepresentativeReport}
          initializeRepresentativeReport={props.initializeRepresentativeReport}
          cancelRepresentativeReport={props.cancelRepresentativeReport}
          reportSubmissionStatus={props.reportSubmissionStatus}
        />
      );
    };

    if (
      isLoading &&
      !isErrorFetchRepresentatives &&
      props.currentQuery.searchCounter > 0
    ) {
      return (
        <div className="row results-section">
          <div className="loading-indicator-container">
            <va-loading-indicator
              label="Searching"
              message="Searching for representatives..."
              set-focus
            />
          </div>
        </div>
      );
    }

    return (
      <div className="row results-section">
        <VaModal
          modalTitle="Were sorry, something went wrong"
          message="Please try again soon."
          onCloseEvent={() =>
            props.clearError(ErrorTypes.reportSubmissionError)
          }
          visible={props.isErrorReportSubmission}
          status="error"
          uswds
        >
          <p>Please try again soon.</p>
        </VaModal>

        <div id="search-results-title" ref={searchResultTitleRef}>
          {isDisplayingResults &&
            !isErrorFetchRepresentatives && (
              <>
                <SearchResultsHeader
                  searchResults={props.searchResults}
                  query={currentQuery}
                  updateSearchQuery={props.updateSearchQuery}
                  commitSearchQuery={props.commitSearchQuery}
                  pagination={props.pagination}
                />{' '}
                {resultsList()}
                {paginationWrapper()}
              </>
            )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <nav className="va-nav-breadcrumbs">{renderBreadcrumbs()}</nav>
          <article className="usa-content">
            {renderSearchSection()}
            {renderResultsSection()}
            <GetFormHelp />
          </article>
        </div>
      </div>
    </>
  );
};

SearchPage.propTypes = {
  cancelRepresentativeReport: PropTypes.func,
  clearError: PropTypes.func,
  clearSearchResults: PropTypes.func,
  clearSearchText: PropTypes.func,
  currentQuery: PropTypes.object,
  errors: PropTypes.shape({
    isErrorGeocode: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
      PropTypes.oneOf([null]),
    ]),
  }),
  fetchRepresentatives: PropTypes.func,
  geocodeUserAddress: PropTypes.func,
  geolocateUser: PropTypes.func,
  initializeRepresentativeReport: PropTypes.func,
  isErrorFetchRepresentatives: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  isErrorGeocode: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  isErrorReportSubmission: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({
      address: PropTypes.string,
      distance: PropTypes.string,
      name: PropTypes.string,
      lat: PropTypes.string,
      long: PropTypes.string,
      page: PropTypes.string,
      perPage: PropTypes.string,
      sort: PropTypes.string,
      type: PropTypes.string,
      searchArea: PropTypes.string,
    }),
    search: PropTypes.string,
  }),
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalEntries: PropTypes.number,
  }),
  reportSubmissionStatus: PropTypes.string,
  reportedResults: PropTypes.array,
  results: PropTypes.array,
  searchResults: PropTypes.array,
  searchWithBounds: PropTypes.func,
  searchWithInput: PropTypes.func,
  searchWithInputInProgress: PropTypes.bool,
  sortType: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  updateSearchQuery: PropTypes.func,
  commitSearchQuery: PropTypes.func,
  onSubmit: PropTypes.func,
};

const mapStateToProps = state => ({
  currentQuery: state.searchQuery,
  errors: state.errors,
  searchResults: state.searchResult.searchResults,
  isErrorFetchRepresentatives: state.errors.isErrorFetchRepresentatives,
  isErrorReportSubmission: state.errors.isErrorReportSubmission,
  resultTime: state.searchResult.resultTime,
  pagination: state.searchResult.pagination,
  reportSubmissionStatus: state.searchResult.reportSubmissionStatus,
  selectedResult: state.searchResult.selectedResult,
  reportedResults: state.searchResult.reportedResults,
  sortType: state.searchResult.sortType,
  specialties: state.searchQuery.specialties,
});

const mapDispatchToProps = {
  geolocateUser,
  geocodeUserAddress,
  fetchRepresentatives,
  searchWithInput,
  updateSearchQuery,
  commitSearchQuery,
  clearSearchResults,
  clearSearchText,
  submitRepresentativeReport,
  initializeRepresentativeReport,
  cancelRepresentativeReport,
  updateFromLocalStorage,
  clearError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
