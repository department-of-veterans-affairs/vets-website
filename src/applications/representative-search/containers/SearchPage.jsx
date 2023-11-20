import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isEmpty } from 'lodash';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import SearchControls from '../components/search/SearchControls';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import ResultsList from '../components/search/ResultsList';
import PaginationWrapper from '../components/search/PaginationWrapper';
// import { fetchRepresentativeSearchResults } from '../actions/index';

// import { setFocus } from '../utils/helpers';

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

  const updateUrlParams = params => {
    const { location, currentQuery } = props;

    const queryParams = {
      ...location.query,
      address: currentQuery.locationInputString,
      latitude: currentQuery.position?.latitude,
      longitude: currentQuery.position?.longitude,
      page: currentQuery.currentPage,
      /* eslint-disable camelcase */
      per_page: 10,
      sort: currentQuery.sortType.toLowerCase(),
      type: currentQuery.representativeType,
      name: currentQuery.repOrganizationInputString,

      ...params,
    };
    const queryStringObj = appendQuery(
      `/get-help-from-accredited-representative/find-rep${location.pathname}`,
      queryParams,
    );
    browserHistory.push(queryStringObj);
  };

  const handleSearch = async () => {
    const { currentQuery } = props;
    const {
      locationInputString,
      repOrganizationInputString,
      representativeType,
    } = currentQuery;

    props.geocodeUserAddress(currentQuery);

    props.updateSearchQuery({
      locationQueryString: locationInputString,
      repOrganizationQueryString: repOrganizationInputString,
      representativeType,
    });

    setIsSearching(true);
  };

  useEffect(
    () => {
      if (props.currentQuery.geocodeError) {
        setIsSearching(false);
      }
    },
    [props.currentQuery.geocodeError],
  );

  const handleSearchOnQueryChange = () => {
    clearGeocodeError();

    if (isSearching) {
      const { currentQuery } = props;
      const {
        locationInputString,
        repOrganizationInputString,
        representativeType,
        position,
        sortType,
      } = currentQuery;

      const { latitude, longitude } = position;

      updateUrlParams({
        address: locationInputString,
        name: repOrganizationInputString || null,
        type: representativeType,
      });
      // setIsSearching(true);

      // TODO: useeffect for when results changes
      focusElement('#search-results-subheader');

      if (!props.searchWithInputInProgress) {
        props.searchWithInput({
          address: locationInputString,
          lat: latitude,
          long: longitude,
          name: repOrganizationInputString,
          page: 1,
          per_page: 10,
          sort: sortType,
          type: representativeType,
        });
        setIsSearching(false);
      }
    }
  };

  useEffect(
    () => {
      handleSearchOnQueryChange();
    },
    [props.currentQuery.id],
  );

  const searchWithUrl = () => {
    // Check for scenario when results are in the store
    if (!!props.location.search && props.results && props.results.length > 0) {
      return;
    }
    const { location } = props;

    if (!isEmpty(location.query)) {
      props.updateSearchQuery({
        locationQueryString: location.query.address,
        locationInputString: location.query.address,
        repOrganizationQueryString: location.query.name,
        repOrganizationInputString: location.query.name,
        representativeType: location.query.type,
      });
    }

    if (location.query.address) {
      props.updateSearchQuery({
        locationQueryString: location.query.address,
        // context: location.query.context,
      });
      // setIsSearching(true);
    }
  };

  const handlePageSelect = e => {
    const { page } = e.detail;
    focusElement('#search-results-subheader');

    props.updateSearchQuery({ page });
  };

  const renderBreadcrumbs = () => {
    return [
      {
        href: '#one',
        label: 'Home',
      },
      {
        href: '#two',
        label: 'Get help from a VA accredited representative',
      },
      {
        href: '#three',
        label: 'Find a VA accredited representative',
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
    const queryContext = currentQuery.context;

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
          sortType={props.sortType}
          onUpdateSortType={props.updateSortType}
        />
      );
    };

    if (isSearching) {
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
          {!searchError &&
            !currentQuery.inProgress &&
            !isSearching && (
              <>
                {' '}
                <SearchResultsHeader
                  searchResults={props.searchResults}
                  representativeType={currentQuery.representativeType}
                  userLocation={currentQuery.locationQueryString}
                  context={queryContext}
                  inProgress={currentQuery.inProgress}
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

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    searchWithUrl();
  }, []);

  // useEffect(
  //   () => {
  //     if (searchResultTitleRef.current && props.resultTime) {
  //       setFocus(searchResultTitleRef.current);
  //     }
  //   },
  //   [props.resultTime],
  // );

  return (
    <>
      <VaBreadcrumbs breadcrumbList={renderBreadcrumbs()} uswds />

      <div className="usa-grid usa-width-three-fourths search-page-container">
        <div className="title-section vads-u-padding-y--1">
          <h1>Find a VA accredited representative</h1>
          <p>
            Find a representative to help you file a claim, submit an appeal, or
            request a decision review. Then contact them to ask if they’re
            available to help.
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
  clearSearchText: PropTypes.func.isRequired,
  currentQuery: PropTypes.object.isRequired,
  geolocateUser: PropTypes.func.isRequired,
  searchWithBounds: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  sortType: PropTypes.string.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  // updateSortType: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalEntries: PropTypes.number,
  }),
  searchWithInputInProgress: PropTypes.bool,
  searchError: PropTypes.object,
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
