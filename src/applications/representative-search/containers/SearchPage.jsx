/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaBreadcrumbs,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { isEmpty } from 'lodash';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
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
  geolocateUser,
  geocodeUserAddress,
  submitRepresentativeReport,
  initializeRepresentativeReport,
  updateFromLocalStorage,
  clearError,
} from '../actions';

const SearchPage = props => {
  const searchResultTitleRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplayingResults, setIsDisplayingResults] = useState(false);

  const updateUrlParams = params => {
    const { location, currentQuery } = props;

    const queryParams = {
      ...location.query,
      address: currentQuery.locationInputString,
      lat: currentQuery.position?.latitude,
      long: currentQuery.position?.longitude,
      page: currentQuery.page || 1,
      perPage: 10,
      sort: currentQuery.sortType.toLowerCase(),
      type: currentQuery.representativeType,
      name: currentQuery.representativeInputString,
      ...params,
    };

    if (currentQuery.searchArea !== null) {
      queryParams.distance = currentQuery.searchArea;
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
  };

  const handleSearchViaUrl = () => {
    // Check for scenario when results are in the store
    if (!!props.location.search && props.results && props.results.length > 0) {
      return;
    }

    const { location } = props;

    if (!isEmpty(location.query)) {
      setIsSearching(true);

      props.updateSearchQuery({
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
      });
    }
  };

  const handleSearchOnQueryChange = () => {
    const { currentQuery } = props;
    const {
      context,
      representativeInputString,
      representativeType,
      position,
      sortType,
      page,
      searchArea,
    } = currentQuery;

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

    if (!props.searchWithInputInProgress) {
      props.searchWithInput({
        address: currentQuery.context.location,
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
    props.updateSearchQuery({ id: Date.now(), page });
  };

  // Trigger request on query update following search
  useEffect(
    () => {
      if (isSearching && !props.errors.isErrorGeocode) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.id],
  );

  // Trigger request on sort update
  useEffect(
    () => {
      if (props.currentQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.sortType],
  );

  // Trigger request on page update
  useEffect(
    () => {
      if (props.currentQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [props.currentQuery.page],
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
            An accredited attorney, claims agent, or Veterans Service Officer
            (VSO) can help you file a claim or request a decision review. Use
            our search tool to find one of these types of accredited
            representatives to help you.
          </p>
          <p>
            <strong>Note:</strong> You’ll need to contact the accredited
            representative you’d like to appoint to make sure they’re available
            to help you.
          </p>
        </div>

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
  reportedResults: PropTypes.array,
  reportSubmissionStatus: PropTypes.string,
  results: PropTypes.array,
  searchResults: PropTypes.array,
  searchWithBounds: PropTypes.func,
  searchWithInput: PropTypes.func,
  searchWithInputInProgress: PropTypes.bool,
  sortType: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  initializeRepresentativeReport: PropTypes.func,
  updateSearchQuery: PropTypes.func,
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
  clearSearchResults,
  clearSearchText,
  submitRepresentativeReport,
  initializeRepresentativeReport,
  updateFromLocalStorage,
  clearError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
