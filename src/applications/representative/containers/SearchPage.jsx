import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

// import appendQuery from 'append-query';
// import { browserHistory } from 'react-router';
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
  updateSearchQuery,
  updateSortType,
  geolocateUser,
  clearGeocodeError,
  mockSearch,
  mockSearchPage2,
} from '../actions';

const SearchPage = props => {
  const searchResultTitleRef = useRef(null);
  // const [isSearching, setIsSearching] = useState(false);

  // const updateUrlParams = params => {
  //   const { location, currentQuery } = props;
  //   const queryParams = {
  //     ...location.query,
  //     page: currentQuery.currentPage,
  //     address: currentQuery.locationInputString,
  //     representativeType: currentQuery.representativeType,
  //     latitude: props.currentQuery.position?.latitude,
  //     longitude: props.currentQuery.position?.longitude,
  //     radius: props.currentQuery.radius && props.currentQuery.radius.toFixed(),
  //     bounds: props.currentQuery.bounds,
  //     ...params,
  //   };
  //   const queryStringObj = appendQuery(
  //     `/find-representatives${location.pathname}`,
  //     queryParams,
  //   );
  //   browserHistory.push(queryStringObj);
  // };

  const handleSearch = async () => {
    // const { currentQuery } = props;
    // const { locationInputString } = currentQuery;

    // updateUrlParams({
    //   address: locationInputString,
    // });
    // setIsSearching(true);
    focusElement('#search-results-subheader');

    props.mockSearch();
  };

  const handlePageSelect = e => {
    const { page } = e.detail;
    focusElement('#search-results-subheader');

    if (page === 1) {
      props.mockSearch();
    } else {
      props.mockSearchPage2();
    }
    // const { currentQuery } = props;
    // const coords = currentQuery.position;
    // const { radius } = currentQuery;
    // const center = [coords.latitude, coords.longitude];
    // props.searchWithBounds({
    //   bounds: currentQuery.bounds,
    //   representativeType: currentQuery.representativeType,
    //   page,
    //   center,
    //   radius,
    // });
  };

  const renderBreadcrumbs = () => {
    return [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/" key="disability">
        Disability
      </a>,
      <a href="/" key="find-an-accredited-representative">
        Find an Accredited Representative
      </a>,
      <a href="/" key="find-a-representative">
        Find a Representative
      </a>,
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
          searchResults={searchResults}
          sortType={props.sortType}
          onUpdateSortType={props.updateSortType}
        />
      );
    };

    return (
      <div className="representative-search-results-container">
        <div id="search-results-title" ref={searchResultTitleRef}>
          {/* {!searchError && ( */}

          {/* )} */}
          {searchError && <p />}
        </div>
        <div>
          {searchResults ? (
            <>
              {' '}
              <SearchResultsHeader
                searchResults={props.searchResults}
                representativeType={currentQuery.representativeType}
                userLocation={currentQuery.locationInputString}
                context={queryContext}
                inProgress={currentQuery.inProgress}
                pagination={props.pagination}
              />{' '}
              {resultsList()}
            </>
          ) : null}
        </div>
        {paginationWrapper()}
      </div>
    );
  };

  // const searchCurrentArea = () => {
  //   const { currentQuery } = props;
  //   const {
  //     searchArea,
  //     // context,
  //     // locationInputString
  //   } = currentQuery;
  //   const coords = currentQuery.position;
  //   const { radius } = currentQuery;
  //   const center = [coords.latitude, coords.longitude];
  //   if (searchArea) {
  //     // updateUrlParams({
  //     //   context,
  //     //   locationInputString,
  //     // });
  //     props.searchWithBounds({
  //       bounds: props.currentQuery.bounds,
  //       representativeType: props.currentQuery.representativeType,
  //       page: props.currentQuery.currentPage,
  //       center,
  //       radius,
  //     });
  //   }
  // };

  // const handleSearchOnQueryChange = () => {
  //   if (isSearching) {
  //     // updateUrlParams({
  //     //   context: props.currentQuery.context,
  //     //   address: props.currentQuery.locationInputString,
  //     // });
  //     const { currentQuery } = props;
  //     const coords = currentQuery.position;
  //     const { radius } = currentQuery;
  //     const center = [coords.latitude, coords.longitude];
  //     const resultsPage = currentQuery.currentPage;

  //     if (!props.searchBoundsInProgress) {
  //       props.searchWithBounds({
  //         bounds: props.currentQuery.bounds,
  //         representativeType: props.currentQuery.representativeType,
  //         page: resultsPage,
  //         center,
  //         radius,
  //       });
  //       setIsSearching(false);
  //     }
  //   }
  // };

  // useEffect(
  //   () => {
  //     searchCurrentArea();
  //   },
  //   [props.currentQuery.searchArea],
  // );

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
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
      <va-breadcrumbs>{renderBreadcrumbs()}</va-breadcrumbs>

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
  mockSearch: PropTypes.func,
  mockSearchPage2: PropTypes.func,
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
  searchBoundsInProgress: PropTypes.bool,
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
  fetchRepresentatives,
  updateSearchQuery,
  updateSortType,
  clearSearchResults,
  clearSearchText,
  mockSearch,
  mockSearchPage2,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
