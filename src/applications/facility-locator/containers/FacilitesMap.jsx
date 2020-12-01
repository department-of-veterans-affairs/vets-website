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
  genSearchAreaFromCenter,
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

import mapboxClient from '../components/MapboxClient';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';

const mbxClient = mbxGeo(mapboxClient);

import {
  setFocus,
  buildMarker,
  resetMapElements,
  setSearchAreaPosition,
} from '../utils/helpers';
import { MapboxInit, MARKER_LETTERS } from '../constants';
import { distBetween } from '../utils/facilityDistance';
import { isEmpty } from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SearchResult from '../components/SearchResult';
import { recordZoomEvent, recordPanEvent } from '../utils/analytics';
import { otherToolsLink, coronavirusUpdate } from '../utils/mapLinks';
import SearchAreaControl from '../utils/SearchAreaControl';
import recordEvent from 'platform/monitoring/record-event';

let currentZoom = 3;
let searchAreaSet = false;

const FacilitiesMap = props => {
  const [map, setMap] = useState(null);
  const searchResultTitleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 481);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Search when the component renders with a sharable url
   */
  const searchWithUrl = () => {
    // Check for scenario when results are in the store
    if (!!props.location.search && props.results && props.results.length > 0) {
      return;
    }
    const { location } = props;

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
      });
      setIsSearching(true);
    }
  };

  const updateUrlParams = params => {
    const { location, currentQuery } = props;

    const queryParams = {
      ...location.query,
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

    const locationBounds = new mapboxgl.LngLatBounds();

    sortedLocations.forEach(loc => {
      const attrs = {
        letter: markersLetters.next().value,
      };
      locationBounds.extend(
        new mapboxgl.LngLat(loc.attributes.long, loc.attributes.lat),
      );
      const markerElement = buildMarker('location', { loc, attrs });
      new mapboxgl.Marker(markerElement)
        .setLngLat([loc.attributes.long, loc.attributes.lat])
        .addTo(map);
    });

    if (props.currentQuery.searchCoords) {
      const { searchCoords } = props.currentQuery;
      const markerElement = buildMarker('currentPos');
      new mapboxgl.Marker(markerElement)
        .setLngLat([searchCoords.lng, searchCoords.lat])
        .addTo(map);
      locationBounds.extend(
        new mapboxgl.LngLat(searchCoords.lng, searchCoords.lat),
      );
    }

    if (props.currentQuery.searchArea) {
      const { locationCoords } = props.currentQuery.searchArea;
      const markerElement = buildMarker('currentPos');
      new mapboxgl.Marker(markerElement)
        .setLngLat([locationCoords.lng, locationCoords.lat])
        .addTo(map);
      locationBounds.extend(
        new mapboxgl.LngLat(locationCoords.lng, locationCoords.lat),
      );
    }

    map.fitBounds(locationBounds, { padding: 20 });
  };

  const handleSearch = async () => {
    resetMapElements();
    const { currentQuery } = props;
    currentZoom = null;

    updateUrlParams({
      address: currentQuery.searchString,
    });

    props.genBBoxFromAddress({
      ...currentQuery,
    });

    setIsSearching(true);
  };

  const handleSearchArea = () => {
    resetMapElements();
    const { currentQuery } = props;
    currentZoom = null;
    const center = map.getCenter().wrap();

    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': currentQuery.facilityType,
      'fl-search-svc-type': currentQuery.serviceType,
    });

    props.genSearchAreaFromCenter({
      lat: center.lat,
      lng: center.lng,
    });
  };

  const handlePageSelect = page => {
    resetMapElements();
    const { currentQuery } = props;
    const coords = currentQuery.position;
    const radius = currentQuery.radius;
    const center = [coords.latitude, coords.longitude];
    props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
      center,
      radius,
    });
  };

  const setupMap = (setMapInit, mapContainerInit) => {
    mapboxgl.accessToken = mapboxToken;
    const mapInit = new mapboxgl.Map({
      container: mapContainerInit,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.lng, MapboxInit.centerInit.lat],
      zoom: MapboxInit.zoomInit,
    });

    const searchAreaControl = new SearchAreaControl(isMobile);
    mapInit.addControl(searchAreaControl);
    mapInit.addControl(new mapboxgl.NavigationControl(), 'top-left');
    setSearchAreaPosition();
    mapInit.on('load', () => {
      setMapInit(mapInit);
      mapInit.resize();
    });

    mapInit.on('zoomend', () => {
      const zoomNotFromSearch =
        document.activeElement.id !== 'search-results-title';
      if (currentZoom && parseInt(currentZoom, 10) > 3 && zoomNotFromSearch) {
        recordZoomEvent(currentZoom, parseInt(mapInit.getZoom(), 10));
      }
      currentZoom = parseInt(mapInit.getZoom(), 10);
    });
    return mapInit;
  };

  /**
   * Map is ready and there is results in the store
   * For example coming back from a detail page
   */
  if (props.results.length > 0 && map) {
    // Set dragend to track map-moved ga event
    map.on('dragend', () => {
      const searchAreaControlId = document.getElementById(
        'search-area-control-container',
      );

      if (searchAreaControlId.style.display === 'none') {
        searchAreaControlId.style.display = 'block';
      }

      if (searchAreaControlId && !searchAreaSet) {
        searchAreaControlId.addEventListener('click', handleSearchArea, false);
        searchAreaSet = true;
      }

      recordPanEvent(map.getCenter(), props.currentQuery);
    });
  }

  /**
   * Setup map on resize
   */
  const setMapResize = () => {
    setTimeout(function() {
      setupMap(setMap, 'mapbox-gl-container');
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
              <Tab
                onClick={() => {
                  searchAreaSet = false;
                }}
                className="small-6 tab"
              >
                View List
              </Tab>
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
                id="mapbox-gl-container"
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
    if (
      map &&
      (!window.document.getElementById('mapbox-gl-container') ||
        window.document.getElementsByClassName('desktop-map-container')
          .length === 0)
    ) {
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
        <div className="desktop-map-container" id="mapbox-gl-container" />
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

  const genLocationFromCoords = position => {
    mbxClient
      .reverseGeocode({
        query: [position.longitude, position.latitude],
        types: ['address'],
      })
      .send()
      .then(({ body: { features } }) => {
        const placeName = features[0].place_name;
        const zipCode =
          features[0].context.find(v => v.id.includes('postcode')).text || '';

        props.updateSearchQuery({
          searchString: placeName,
          context: zipCode,
          position,
        });

        updateUrlParams({
          address: placeName,
          context: zipCode,
        });
      })
      .catch(error => error);
  };

  useEffect(
    () => {
      const { currentQuery } = props;
      const { searchArea, position, context, searchString } = currentQuery;
      const coords = currentQuery.position;
      const radius = currentQuery.radius;
      const center = [coords.latitude, coords.longitude];
      // Search current area
      if (searchArea) {
        updateUrlParams({
          location: `${position.latitude.toFixed(
            2,
          )},${position.longitude.toFixed(2)}`,
          context,
          searchString,
        });
        props.searchWithBounds({
          bounds: props.currentQuery.bounds,
          facilityType: props.currentQuery.facilityType,
          serviceType: props.currentQuery.serviceType,
          page: props.currentQuery.currentPage,
          center,
          radius,
        });
      }
    },
    [props.currentQuery.searchArea],
  );

  useEffect(() => {
    const setMobile = () => {
      setIsMobile(window.innerWidth <= 481);
    };

    searchWithUrl();

    // TODO - improve the geolocation feature with a more react approach
    // https://github.com/department-of-veterans-affairs/vets-website/pull/14963
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(currentPosition => {
        const input = document.getElementById('street-city-state-zip');
        if (input && !input.value) {
          genLocationFromCoords(currentPosition.coords);
        }
      });
    }

    const debouncedResize = vaDebounce(250, setMobile);
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('click', handleSearchArea);
      searchAreaSet = false;
    };
  }, []);

  useEffect(
    () => {
      // Container exists
      if (!window.document.getElementById('mapbox-gl-container')) {
        return;
      }

      if (!map) {
        setupMap(setMap, 'mapbox-gl-container');
      }
    },
    [map],
  );

  // Handle search when query changes
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
        const { currentQuery } = props;
        const coords = currentQuery.position;
        const radius = currentQuery.radius;
        const center = [coords.latitude, coords.longitude];
        const resultsPage = currentQuery.currentPage;

        if (!props.searchBoundsInProgress) {
          props.searchWithBounds({
            bounds: props.currentQuery.bounds,
            facilityType: props.currentQuery.facilityType,
            serviceType: props.currentQuery.serviceType,
            page: resultsPage,
            center,
            radius,
          });
          setIsSearching(false);
        }
        if (searchResultTitleRef.current) {
          setFocus(searchResultTitleRef.current);
        }
      }
    },
    [props.currentQuery.id],
  );

  // Handle build markers when we get results
  useEffect(
    () => {
      if (!map) return;
      renderMarkers(props.results);
    },
    [props.results, map],
  );

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
  genSearchAreaFromCenter,
  searchWithBounds,
  clearSearchResults,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMap);
