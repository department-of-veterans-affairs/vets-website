import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxToken } from '../utils/mapboxToken';
import {
  clearSearchResults,
  fetchVAFacility,
  searchWithBounds,
  genBBoxFromAddress,
  updateSearchQuery,
} from '../actions';
import {
  facilitiesPpmsSuppressCommunityCare,
  facilitiesPpmsSuppressPharmacies,
  facilityLocatorPredictiveLocationSearch,
} from '../utils/selectors';
import ResultsList from '../components/ResultsList';
import PaginationWrapper from '../components/PaginationWrapper';
import SearchControls from '../components/SearchControls';
import SearchResultsHeader from '../components/SearchResultsHeader';
import { browserHistory } from 'react-router';
import vaDebounce from 'platform/utilities/data/debounce';
import { setFocus } from '../utils/helpers';

const FacilitiesMap = props => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const searchResultTitleRef = useRef(null);
  // const [isMobile, setIsMobile] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(
    () => {
      mapboxgl.accessToken = mapboxToken;
      const initializeMap = (setMapInit, mapContainerInit) => {
        const mapInit = new mapboxgl.Map({
          container: mapContainerInit.current,
          style: 'mapbox://styles/mapbox/streets-v10',
          center: [0, 0],
          zoom: 5,
        });
        mapInit.addControl(new mapboxgl.NavigationControl(), 'top-left');

        mapInit.on('load', () => {
          setMapInit(mapInit);
          mapInit.resize();
        });
      };

      if (!map) initializeMap(setMap, mapContainer);
    },
    [map],
  );

  const syncStateWithLocation = location => {
    if (
      location.query.address &&
      props.currentQuery.searchString !== location.query.address &&
      !props.currentQuery.inProgress
    ) {
      props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
        usePredictiveGeolocation: props.usePredictiveGeolocation,
      });
    }
  };

  useEffect(() => {
    const listener = browserHistory.listen(location => {
      syncStateWithLocation(location);
    });

    const setMobile = () => {
      // setIsMobile(window.innerWidth <= 481);
    };

    const debouncedResize = vaDebounce(250, setMobile);
    window.addEventListener('resize', debouncedResize);
    return () => {
      listener();
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const updateUrlParams = params => {
    const { location, currentQuery } = props;

    const queryParams = {
      ...location.query,
      zoomLevel: currentQuery.zoomLevel,
      page: currentQuery.currentPage,
      address: currentQuery.searchString,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      ...params,
    };

    const queryStringObj = appendQuery(
      `/find-locations${location.pathname}`,
      queryParams,
    );

    browserHistory.push(queryStringObj);
  };

  useEffect(
    () => {
      if (isSearching) {
        updateUrlParams({
          location: `${props.currentQuery.position.latitude},${
            props.currentQuery.position.longitude
          }`,
          context: props.currentQuery.context,
          address: props.currentQuery.searchString,
        });
        const resultsPage = props.currentQuery.currentPage;

        if (!props.searchBoundsInProgress) {
          props.searchWithBounds({
            bounds: props.currentQuery.bounds,
            facilityType: props.currentQuery.facilityType,
            serviceType: props.currentQuery.serviceType,
            page: resultsPage,
          });
          setIsSearching(false);
        }
        if (searchResultTitleRef.current) {
          setFocus(searchResultTitleRef.current);
        }
      }
      return () => {
        // remove the listeners
      };
    },
    [props.currentQuery.id], // Handle search when query changes
  );

  const otherToolsLink = () => (
    <div id="other-tools">
      Can’t find what you’re looking for?&nbsp;&nbsp;
      {/* Add a line break for mobile, which uses white-space: pre-line */}
      {'\n'}
      <a href="https://www.va.gov/directory/guide/home.asp">
        Try using our other tools to search.
      </a>
    </div>
  );

  const coronavirusUpdate = (
    <>
      Please call first to confirm services or ask about getting help by phone
      or video. We require everyone entering a VA facility to wear a{' '}
      <a href="/coronavirus-veteran-frequently-asked-questions/#more-health-care-questions">
        mask that covers their mouth and nose.
      </a>{' '}
      Get answers to questions about COVID-19 and VA benefits and services with
      our <a href="/coronavirus-chatbot/">coronavirus chatbot</a>.
    </>
  );

  const handleSearch = async () => {
    const { currentQuery, usePredictiveGeolocation } = props;

    updateUrlParams({
      address: currentQuery.searchString,
    });

    props.genBBoxFromAddress({
      ...currentQuery,
      usePredictiveGeolocation,
    });
    setIsSearching(true);
  };

  const handlePageSelect = page => {
    const { currentQuery } = props;
    props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
    });
  };

  const renderViews = () => {
    // Handle both mobile and desktop here?
    const {
      currentQuery,
      results,
      pagination: { currentPage, totalPages },
    } = props;
    const facilityType = currentQuery.facilityType;
    const serviceType = currentQuery.serviceType;
    const queryContext = currentQuery.context;
    return (
      <div className="desktop-container">
        <SearchControls
          currentQuery={currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          suppressCCP={props.suppressCCP}
          suppressPharmacies={props.suppressPharmacies}
        />
        <div id="search-results-title" ref={searchResultTitleRef}>
          <SearchResultsHeader
            results={results}
            facilityType={facilityType}
            serviceType={serviceType}
            context={queryContext}
            inProgress={currentQuery.inProgress}
          />
        </div>
        <div
          className="columns search-results-container medium-4 small-12"
          id="searchResultsContainer"
        >
          <div className="facility-search-results">
            <ResultsList
              updateUrlParams={updateUrlParams}
              query={currentQuery}
            />
          </div>
        </div>
        <div
          className="desktop-map-container"
          ref={el => {
            mapContainer.current = el;
            return true;
          }}
        />
        <PaginationWrapper
          handlePageSelect={handlePageSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          results={results}
          inProgress={currentQuery.inProgress}
        />
      </div>
    );
  };

  return (
    <>
      <div>
        <div className="title-section">
          <h1>Find VA locations</h1>
        </div>
        <div className="facility-introtext">
          <p>
            Find a VA location or in-network community care provider. For
            same-day care for minor illnesses or injuries, select Urgent care
            for facility type.
          </p>
          <p>
            <strong>Coronavirus update:</strong> {coronavirusUpdate}
          </p>
        </div>
        {renderViews()}
      </div>
      {props.results && props.results.length > 0 && otherToolsLink()}
    </>
  );
};

const mapStateToProps = state => ({
  currentQuery: state.searchQuery,
  suppressPharmacies: facilitiesPpmsSuppressPharmacies(state),
  suppressCCP: facilitiesPpmsSuppressCommunityCare(state),
  usePredictiveGeolocation: facilityLocatorPredictiveLocationSearch(state),
  results: state.searchResult.results,
  pagination: state.searchResult.pagination,
  selectedResult: state.searchResult.selectedResult,
});

const mapDispatchToProps = {
  fetchVAFacility,
  updateSearchQuery,
  genBBoxFromAddress,
  searchWithBounds,
  clearSearchResults,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMap);
