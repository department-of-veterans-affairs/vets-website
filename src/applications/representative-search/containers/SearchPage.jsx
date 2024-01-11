/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { isEmpty } from 'lodash';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import SearchControls from '../components/search/SearchControls';
import SearchResultsHeader from '../components/results/SearchResultsHeader';
import ResultsList from '../components/results/ResultsList';
import PaginationWrapper from '../components/results/PaginationWrapper';

import {
  clearSearchText,
  clearSearchResults,
  fetchRepresentatives,
  searchWithInput,
  updateSearchQuery,
  updateSortType,
  geolocateUser,
  geocodeUserAddress,
  clearGeocodeError,
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
    const queryStringObj = appendQuery(
      `/get-help-from-accredited-representative/find-rep${location.pathname}`,
      queryParams,
    );
    browserHistory.push(queryStringObj);
  };

  const handleSearch = async () => {
    clearGeocodeError();
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
    } = currentQuery;

    const { latitude, longitude } = position;

    setIsSearching(true);

    updateUrlParams({
      address: context.location,
      name: representativeInputString || null,
      lat: latitude,
      long: longitude,
      type: representativeType,
      page: page || 1,
      sort: sortType,
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
      if (isSearching && !props.currentQuery.geocodeError) {
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
      if (isSearching && props.currentQuery.geocodeError) {
        setIsSearching(false);
      }
    },
    [props.currentQuery.geocodeError],
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
    return [
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/get-help-from-accredited-representative',
        label: 'Get help from a VA accredited representative',
      },
      {
        href: '/get-help-from-accredited-representative/find-rep',
        label: 'Find a VA accredited representative or VSO',
      },
    ];
  };

  const renderView = () => {
    const {
      currentQuery,
      searchResults,
      // sortType,
      pagination,
      searchError,
    } = props;

    // const currentPage = pagination ? pagination.currentPage : 1;
    // const totalPages = pagination ? pagination.totalPages : 1;
    // const { representativeType } = currentQuery;

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
          // updateUrlParams={updateUrlParams}
          query={currentQuery}
          inProgress={currentQuery.inProgress}
          searchResults={searchResults}
          sortType={currentQuery.sortType}
          onUpdateSortType={props.updateSortType}
        />
      );
    };

    if (isLoading && !searchError) {
      return (
        <div>
          <va-loading-indicator message="Search in progress" />
        </div>
      );
    }

    return (
      <div className="representative-search-results-container">
        <div id="search-results-title" ref={searchResultTitleRef}>
          {searchError && (
            <div className="vads-u-margin-y--3 representative-results-list">
              <va-alert
                close-btn-aria-label="Close notification"
                status="error"
                uswds
                visible
              >
                <h2 slot="headline">Sorry, something went wrong on our end</h2>
                <React.Fragment key=".1">
                  <p className="vads-u-margin-y--0">Please try again soon.</p>
                </React.Fragment>
              </va-alert>
            </div>
          )}

          {isDisplayingResults &&
            !searchError && (
              <>
                <SearchResultsHeader
                  searchResults={props.searchResults}
                  query={currentQuery}
                  updateSearchQuery={props.updateSearchQuery}
                  pagination={props.pagination}
                />{' '}
                {resultsList()}
              </>
            )}
        </div>
        {paginationWrapper()}
      </div>
    );
  };

  return (
    <>
      <VaBreadcrumbs breadcrumbList={renderBreadcrumbs()} uswds />

      <div className="usa-grid usa-width-three-fourths search-page-container">
        <div className="title-section vads-u-padding-y--1">
          <h1>Find a VA accredited representative or VSO</h1>
          <p>
            Find a representative who can help you file a claim or request a
            decision review. Then contact them to ask if they’re available to
            help.
          </p>
        </div>

        <SearchControls
          geolocateUser={props.geolocateUser}
          currentQuery={props.currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          clearSearchText={props.clearSearchText}
          clearGeocodeError={props.clearGeocodeError}
        />
        {renderView()}
      </div>
    </>
  );
};

SearchPage.propTypes = {
  clearGeocodeError: PropTypes.func,
  clearSearchResults: PropTypes.func,
  clearSearchText: PropTypes.func,
  currentQuery: PropTypes.object,
  fetchRepresentatives: PropTypes.func,
  geocodeUserAddress: PropTypes.func,
  geolocateUser: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({
      address: PropTypes.string,
      name: PropTypes.string,
      lat: PropTypes.number,
      long: PropTypes.number,
      page: PropTypes.number,
      perPage: PropTypes.number,
      sort: PropTypes.string,
      type: PropTypes.string,
    }),
    search: PropTypes.string,
  }),
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalEntries: PropTypes.number,
  }),
  results: PropTypes.array,
  searchError: PropTypes.object,
  searchResults: PropTypes.array,
  searchWithBounds: PropTypes.func,
  searchWithInput: PropTypes.func,
  searchWithInputInProgress: PropTypes.bool,
  sortType: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  updateSortType: PropTypes.func,
  onSubmit: PropTypes.func,
};

const mapStateToProps = state => ({
  currentQuery: state.searchQuery,
  searchResults: state.searchResult.searchResults,
  searchError: state.searchResult.error,
  resultTime: state.searchResult.resultTime,
  pagination: state.searchResult.pagination,
  selectedResult: state.searchResult.selectedResult,
  sortType: state.searchResult.sortType,
  specialties: state.searchQuery.specialties,
});

const mapDispatchToProps = {
  geolocateUser,
  clearGeocodeError,
  geocodeUserAddress,
  fetchRepresentatives,
  searchWithInput,
  updateSearchQuery,
  updateSortType,
  clearSearchResults,
  clearSearchText,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
