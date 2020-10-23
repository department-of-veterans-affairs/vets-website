import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import Helmet from 'react-helmet';
import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css'; webpack issue
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
import { setFocus, clearLocationMarkers, buildMarker } from '../utils/helpers';
import { MARKER_LETTERS } from '../constants';
import { distBetween } from '../utils/facilityDistance';
import { isEmpty } from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SearchResult from '../components/SearchResult';

const FacilitiesMap = props => {
  const [map, setMap] = useState(null);
  // const mapContainer = useRef(null);
  const searchResultTitleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 481);
  const [isSearching, setIsSearching] = useState(false);
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

  /**
   * Search when the component renders with a sharable url
   */
  const searchWithUrl = () => {
    // Check for scenario when results are in the store
    if (!!props.location.search && props.results && props.results.length > 0) {
      return;
    }
    const { location, usePredictiveGeolocation } = props;

    if (!isEmpty(location.query)) {
      props.updateSearchQuery({
        facilityType: location.query.facilityType,
        serviceType: location.query.serviceType,
      });
    }

    if (location.query.address) {
      props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
        usePredictiveGeolocation,
      });
      setIsSearching(true);
    }
  };

  useEffect(() => {
    const listener = browserHistory.listen(location => {
      syncStateWithLocation(location);
    });

    const setMobile = () => {
      setIsMobile(window.innerWidth <= 481);
    };

    searchWithUrl();

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

  const renderMarkers = locations => {
    if (locations.length === 0) return;
    const currentLocation = props.currentQuery.position;
    const markersLetters = MARKER_LETTERS.values();
    const sortedLocations = locations
      .map(r => {
        const distance = currentLocation
          ? distBetween(
              currentLocation.latitude,
              currentLocation.longitude,
              r.attributes.lat,
              r.attributes.long,
            )
          : null;
        return {
          ...r,
          distance,
        };
      })
      .sort((resultA, resultB) => resultA.distance - resultB.distance);

    sortedLocations.forEach(loc => {
      const attrs = {
        letter: markersLetters.next().value,
      };
      const markerElement = buildMarker('location', { loc, attrs });
      new mapboxgl.Marker(markerElement)
        .setLngLat([loc.attributes.long, loc.attributes.lat])
        .addTo(map);
    });

    if (props.currentQuery.bounds) {
      map.fitBounds(props.currentQuery.bounds);
    }
    if (props.currentQuery.searchCoords) {
      const markerElement = buildMarker('currentPos');
      new mapboxgl.Marker(markerElement)
        .setLngLat([
          props.currentQuery.searchCoords.lng,
          props.currentQuery.searchCoords.lat,
        ])
        .addTo(map);
    }
  };

  useEffect(
    () => {
      if (!map) return;
      clearLocationMarkers();
      renderMarkers(props.results);
    },
    [props.results], // Handle build markers when we get results
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

  useEffect(
    () => {
      mapboxgl.accessToken = mapboxToken;
      const initializeMap = (setMapInit, mapContainerInit) => {
        const mapInit = new mapboxgl.Map({
          container: mapContainerInit,
          style: 'mapbox://styles/mapbox/outdoors-v11',
          center: [-99.27246093750001, 40.17887331434698], // Initial state search query reducer
          zoom: 3,
        });
        mapInit.addControl(new mapboxgl.NavigationControl(), 'top-left');

        mapInit.on('load', () => {
          setMapInit(mapInit);
          mapInit.resize();
        });
        // mapInit.on('resize', function() {
        // console.log('A resize event occurred.');
        // });
      };

      if (!window.document.getElementById('mapContainer')) return;
      if (!map) initializeMap(setMap, 'mapContainer');
    },
    [map],
  );

  /**
   * Map is ready and there is results in the store
   * For example coming back from a detail page
   */

  if (props.results.length > 0 && map) {
    renderMarkers(props.results);
  }

  const setMapResize = () => {
    setTimeout(function() {
      const mapMobileTab = new mapboxgl.Map({
        container: 'mapContainer',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [-99.27246093750001, 40.17887331434698],
        zoom: 3,
      });
      mapMobileTab.addControl(new mapboxgl.NavigationControl(), 'top-left');

      mapMobileTab.on('load', () => {
        mapMobileTab.resize();
      });
      setMap(mapMobileTab);
    }, 10);
  };

  const renderMobileView = () => {
    const {
      currentQuery,
      selectedResult,
      results,
      pagination: { currentPage, totalPages },
    } = props;
    const facilityType = currentQuery.facilityType;
    const serviceType = currentQuery.serviceType;
    const queryContext = currentQuery.context;

    return (
      <>
        <SearchControls
          currentQuery={currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          suppressCCP={props.suppressCCP}
          suppressPharmacies={props.suppressPharmacies}
        />
        <div id="search-results-title" ref={searchResultTitleRef}>
          <SearchResultsHeader
            results={props.results}
            facilityType={facilityType}
            serviceType={serviceType}
            context={queryContext}
            inProgress={currentQuery.inProgress}
          />
        </div>
        <div className="columns small-12">
          <Tabs>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab
                onClick={() => {
                  setMapResize();
                }}
                className="small-6 tab"
              >
                View Map
              </Tab>
            </TabList>
            <TabPanel>
              <div className="facility-search-results">
                <ResultsList
                  updateUrlParams={updateUrlParams}
                  query={currentQuery}
                />
              </div>
              <PaginationWrapper
                handlePageSelect={handlePageSelect}
                currentPage={currentPage}
                totalPages={totalPages}
                results={results}
                inProgress={currentQuery.inProgress}
              />
            </TabPanel>
            <TabPanel>
              <div
                style={{ width: '100%', maxHeight: '55vh', height: '55vh' }}
                id="mapContainer"
              />
              {selectedResult && (
                <div className="mobile-search-result">
                  <SearchResult result={selectedResult} query={currentQuery} />
                </div>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </>
    );
  };

  const renderDesktopView = () => {
    // Reset the map after resize event
    if (document.getElementsByClassName('mapboxgl-canvas').length === 0) {
      setMapResize();
    }
    const {
      currentQuery,
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
            results={props.results}
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
        <div className="desktop-map-container" id="mapContainer" />
        <PaginationWrapper
          handlePageSelect={handlePageSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          results={props.results}
          inProgress={currentQuery.inProgress}
        />
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Helmet>
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
        {isMobile ? renderMobileView() : renderDesktopView()}
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
