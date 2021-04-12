import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxToken } from '../utils/mapboxToken';
import {
  clearSearchText,
  clearSearchResults,
  fetchVAFacility,
  searchWithBounds,
  genBBoxFromAddress,
  genSearchAreaFromCenter,
  updateSearchQuery,
  mapMoved,
  geolocateUser,
  clearGeocodeError,
} from '../actions';
import {
  facilitiesPpmsSuppressCommunityCare,
  facilitiesPpmsSuppressPharmacies,
  facilityLocatorPredictiveLocationSearch,
  facilityLocatorLighthouseCovidVaccineQuery,
} from '../utils/selectors';
import ResultsList from '../components/ResultsList';
import PaginationWrapper from '../components/PaginationWrapper';
import SearchControls from '../components/SearchControls';
import SearchResultsHeader from '../components/SearchResultsHeader';
import { browserHistory } from 'react-router';
import vaDebounce from 'platform/utilities/data/debounce';
import environment from 'platform/utilities/environment';

import mapboxClient from '../components/MapboxClient';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';

const mbxClient = mbxGeo(mapboxClient);

import { setFocus, buildMarker, resetMapElements } from '../utils/helpers';
import { MapboxInit, MARKER_LETTERS, MAX_SEARCH_AREA } from '../constants';
import { distBetween } from '../utils/facilityDistance';
import { isEmpty } from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SearchResult from '../components/SearchResult';
import { recordZoomEvent, recordPanEvent } from '../utils/analytics';
import { otherToolsLink, coronavirusUpdate } from '../utils/mapLinks';
import SearchAreaControl from '../components/SearchAreaControl';
import recordEvent from 'platform/monitoring/record-event';

let lastZoom = 3;

const mapboxGlContainer = 'mapbox-gl-container';
const zoomMessageDivID = 'screenreader-zoom-message';

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
      latitude: props.currentQuery.position?.latitude,
      longitude: props.currentQuery.position?.longitude,
      radius: props.currentQuery.radius && props.currentQuery.radius.toFixed(),
      bounds: props.currentQuery.bounds,
      ...params,
    };

    const queryStringObj = appendQuery(
      `/find-locations${location.pathname}`,
      queryParams,
    );

    browserHistory.push(queryStringObj);
  };

  const addMapMarker = searchCoords => {
    const markerElement = buildMarker('currentPos');
    new mapboxgl.Marker(markerElement)
      .setLngLat([searchCoords.lng, searchCoords.lat])
      .addTo(map);
  };

  const renderMarkers = locations => {
    if (locations.length === 0) return;
    const markersLetters = MARKER_LETTERS.values();

    const locationBounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
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
      addMapMarker(searchCoords);
      locationBounds.extend(
        new mapboxgl.LngLat(searchCoords.lng, searchCoords.lat),
      );
      map.fitBounds(locationBounds, { padding: 20 });
    }

    if (props.currentQuery.searchArea) {
      const { locationCoords } = props.currentQuery.searchArea;
      addMapMarker(locationCoords);
      locationBounds.extend(
        new mapboxgl.LngLat(locationCoords.lng, locationCoords.lat),
      );
    }
    if (searchResultTitleRef.current) {
      setFocus(searchResultTitleRef.current);
    }
  };

  const handleSearch = async () => {
    resetMapElements();
    const { currentQuery } = props;
    lastZoom = null;

    updateUrlParams({
      address: currentQuery.searchString,
    });

    props.genBBoxFromAddress({
      ...currentQuery,
    });

    setIsSearching(true);
  };

  const calculateSearchArea = () => {
    const currentBounds = map.getBounds();
    const { _ne, _sw } = currentBounds;
    return distBetween(_ne.lat, _ne.lng, _sw.lat, _sw.lng);
  };

  const handleSearchArea = () => {
    resetMapElements();
    const { currentQuery } = props;
    lastZoom = null;
    const center = map.getCenter().wrap();
    const bounds = map.getBounds();
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': currentQuery.facilityType,
      'fl-search-svc-type': currentQuery.serviceType,
    });
    const currentMapBoundsDistance = calculateSearchArea();

    props.genSearchAreaFromCenter({
      lat: center.lat,
      lng: center.lng,
      currentMapBoundsDistance,
      currentBounds: [
        bounds._sw.lng,
        bounds._sw.lat,
        bounds._ne.lng,
        bounds._ne.lat,
      ],
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

  const speakZoom = (searchRadius, zoomDirection) => {
    const screenreaderZoomElement = document.getElementById(zoomMessageDivID);

    if (screenreaderZoomElement) {
      // delay to allow time for the search area button text to be read
      setTimeout(() => {
        screenreaderZoomElement.innerText = `zooming ${zoomDirection}, ${Math.round(
          searchRadius,
        )} miles`;
      }, 750);
    }
  };

  const setMapEventHandlers = () => {
    map.on('dragend', () => {
      props.mapMoved(calculateSearchArea());
      recordPanEvent(map.getCenter(), props.currentQuery);
    });
    map.on('zoomend', e => {
      // Only trigger mapMoved and speakZoom for manual events,
      // e.g. zoom in/out button click, mouse wheel, etc.
      // which will have an originalEvent defined
      if (!e.originalEvent) {
        return;
      }

      const searchRadius = calculateSearchArea();
      const currentZoom = parseInt(map.getZoom(), 10);

      props.mapMoved(searchRadius);

      if (lastZoom && parseInt(lastZoom, 10) > 3) {
        recordZoomEvent(lastZoom, currentZoom);
      }

      if (lastZoom !== currentZoom) {
        const zoomDirection = currentZoom > lastZoom ? 'in' : 'out';
        speakZoom(searchRadius, zoomDirection);
        lastZoom = currentZoom;
      }
    });
  };

  const setupMap = () => {
    const mapContainerElement = document.getElementById(mapboxGlContainer);
    if (!mapContainerElement) {
      return null;
    }

    mapContainerElement.setAttribute('tabindex', 0);

    mapboxgl.accessToken = mapboxToken;
    const mapInit = new mapboxgl.Map({
      container: mapboxGlContainer,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.lng, MapboxInit.centerInit.lat],
      zoom: MapboxInit.zoomInit,
    });

    mapInit.addControl(
      new mapboxgl.NavigationControl({
        // Hide rotation control.
        showCompass: false,
      }),
      'top-left',
    );

    // Remove mapbox logo from tab order
    const mapBoxLogo = document.querySelector(
      'a.mapboxgl-ctrl-logo.mapboxgl-compact',
    );

    if (mapBoxLogo) mapBoxLogo.setAttribute('tabIndex', -1);

    mapInit.on('load', () => {
      mapInit.resize();
    });

    return mapInit;
  };

  /**
   * Setup map on resize
   */
  const setMapResize = () => {
    setTimeout(function() {
      setMap(setupMap());
    }, 10);
  };

  const shouldRenderSearchArea = () => {
    return props.currentQuery?.mapMoved;
  };

  const searchAreaButtonEnabled = () =>
    calculateSearchArea() < MAX_SEARCH_AREA &&
    props.currentQuery.facilityType &&
    (props.currentQuery.facilityType === 'provider'
      ? props.currentQuery.serviceType
      : true);

  const speakMapInstructions = () => {
    const mapInstructionsElement = document.getElementById('map-instructions');
    if (mapInstructionsElement) {
      mapInstructionsElement.innerText =
        'Search areas on the map up to a maximum of 500 miles. ' +
        'Zoom in or out using the zoom in and zoom out buttons. ' +
        'Use a keyboard to navigate up, down, left, and right in the map.';
    }
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
          geolocateUser={props.geolocateUser}
          clearGeocodeError={props.clearGeocodeError}
          currentQuery={currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          suppressCCP={props.suppressCCP}
          suppressPharmacies={props.suppressPharmacies}
          searchCovid19Vaccine={props.searchCovid19Vaccine}
          clearSearchText={props.clearSearchText}
        />
        <div id="search-results-title" ref={searchResultTitleRef}>
          <SearchResultsHeader
            results={props.results}
            facilityType={facilityType}
            serviceType={serviceType}
            context={queryContext}
            specialtyMap={props.specialties}
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
                id={zoomMessageDivID}
                aria-live="polite"
                className="sr-only"
              />
              <p
                className="sr-only"
                id="map-instructions"
                aria-live="assertive"
              />
              <map
                id={mapboxGlContainer}
                aria-label="Find VA locations on an interactive map"
                aria-describedby="map-instructions"
                onFocus={() => speakMapInstructions()}
              >
                {shouldRenderSearchArea() &&
                  (
                    <SearchAreaControl
                      isMobile
                      isEnabled={searchAreaButtonEnabled()}
                      handleSearchArea={handleSearchArea}
                      query={currentQuery}
                    />
                  )``}
              </map>
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
    if (
      map &&
      (!window.document.getElementById(mapboxGlContainer) ||
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
          geolocateUser={props.geolocateUser}
          clearGeocodeError={props.clearGeocodeError}
          currentQuery={currentQuery}
          onChange={props.updateSearchQuery}
          onSubmit={handleSearch}
          suppressCCP={props.suppressCCP}
          suppressPharmacies={props.suppressPharmacies}
          searchCovid19Vaccine={props.searchCovid19Vaccine}
          clearSearchText={props.clearSearchText}
        />
        <div id="search-results-title" ref={searchResultTitleRef}>
          <SearchResultsHeader
            results={props.results}
            facilityType={facilityType}
            serviceType={serviceType}
            context={queryContext}
            specialtyMap={props.specialties}
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
        <p className="sr-only" id="map-instructions" aria-live="assertive" />
        <div id={zoomMessageDivID} aria-live="assertive" className="sr-only" />
        <map
          className="desktop-map-container"
          id={mapboxGlContainer}
          aria-label="Find VA locations on an interactive map"
          aria-describedby="map-instructions"
          onFocus={() => speakMapInstructions()}
        >
          {shouldRenderSearchArea() && (
            <SearchAreaControl
              isMobile={false}
              isEnabled={searchAreaButtonEnabled()}
              handleSearchArea={handleSearchArea}
              query={currentQuery}
            />
          )}
        </map>
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
      if (map) {
        setMapEventHandlers();
      }
    },
    [map, props.currentQuery.searchCoords],
  );

  useEffect(
    () => {
      const { currentQuery } = props;
      const { searchArea, context, searchString } = currentQuery;
      const coords = currentQuery.position;
      const radius = currentQuery.radius;
      const center = [coords.latitude, coords.longitude];
      // Search current area
      if (searchArea) {
        updateUrlParams({
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
    setMap(setupMap());

    const setMobile = () => {
      setIsMobile(window.innerWidth <= 481);
    };

    searchWithUrl();

    // TODO - remove environment flag once the Use My Location link has been approved on staging
    if (environment.isProduction() && navigator.geolocation) {
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
    };
  }, []); // <-- empty array means 'run once'

  // Handle search when query changes
  useEffect(
    () => {
      if (isSearching) {
        updateUrlParams({
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

  // Handle no results found map transition
  useEffect(
    () => {
      if (
        props.results &&
        props.results.length === 0 &&
        map &&
        props.currentQuery.searchCoords
      ) {
        const { searchCoords } = props.currentQuery;
        const locationBounds = new mapboxgl.LngLatBounds();
        addMapMarker(searchCoords);
        locationBounds.extend(
          new mapboxgl.LngLat(searchCoords.lng, searchCoords.lat),
        );
        map.fitBounds(locationBounds, { maxZoom: 12 });
      }
    },
    [props.currentQuery.searchCoords, props.results],
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
  searchCovid19Vaccine: facilityLocatorLighthouseCovidVaccineQuery(state),
  results: state.searchResult.results,
  pagination: state.searchResult.pagination,
  selectedResult: state.searchResult.selectedResult,
  specialties: state.searchQuery.specialties,
});

const mapDispatchToProps = {
  geolocateUser,
  clearGeocodeError,
  fetchVAFacility,
  updateSearchQuery,
  genBBoxFromAddress,
  genSearchAreaFromCenter,
  searchWithBounds,
  clearSearchResults,
  clearSearchText,
  mapMoved,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMap);
