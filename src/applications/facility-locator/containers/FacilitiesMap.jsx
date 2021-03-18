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

import {
  setFocus,
  buildMarker,
  resetMapElements,
  setSearchAreaPosition,
} from '../utils/helpers';
import { MapboxInit, MARKER_LETTERS, MAX_SEARCH_AREA } from '../constants';
import { distBetween } from '../utils/facilityDistance';
import { isEmpty } from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SearchResult from '../components/SearchResult';
import { recordZoomEvent, recordPanEvent } from '../utils/analytics';
import { otherToolsLink, coronavirusUpdate } from '../utils/mapLinks';
import SearchAreaControl from '../utils/SearchAreaControl';
import recordEvent from 'platform/monitoring/record-event';

let lastZoom = 3;
let searchAreaSet = false;

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
    // Since the Search this Area button doesn't use React,
    // the normal react stuff doesn't work as it should,
    // so we have to check for errors old-school.
    // TODO: revisit this when we convert the Search This Area button to a React component.

    // Location is not required here
    const selectedFacilityType = document.querySelector(
      '#facility-type-dropdown',
    ).selectedOptions[0].value;

    if (
      selectedFacilityType === '' ||
      (selectedFacilityType === 'provider' &&
        document.querySelector('#service-type-ahead-input').value === '')
    ) {
      return;
    }

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

  const activateSearchAreaControl = () => {
    if (!map) {
      return;
    }

    const searchAreaControl = document.getElementById(
      'search-area-control-container',
    );

    if (!searchAreaControl) {
      return;
    }

    // TODO: hide after new search
    if (calculateSearchArea() > MAX_SEARCH_AREA) {
      searchAreaControl.style.display = 'none';
      return;
    }

    if (searchAreaControl.style.display === 'none') {
      searchAreaControl.style.display = 'block';
      setFocus('#search-area-control', false);
    }

    if (searchAreaControl && !searchAreaSet) {
      searchAreaControl.addEventListener('click', handleSearchArea, false);
      searchAreaSet = true;
    }
  };

  const speakZoom = currentZoom => {
    if (!environment.isProduction()) {
      const screenreaderZoomElement = document.getElementById(zoomMessageDivID);

      if (
        screenreaderZoomElement &&
        screenreaderZoomElement.innerText.length === 0
      ) {
        if (lastZoom < currentZoom) {
          screenreaderZoomElement.innerText = `zooming in, level ${currentZoom}`;
        }

        if (lastZoom > currentZoom) {
          screenreaderZoomElement.innerText = `zooming out, level ${currentZoom}`;
        }
      }
    }
  };

  const setMapEventHandlers = () => {
    map.on('dragend', () => {
      props.mapMoved();
      recordPanEvent(map.getCenter(), props.currentQuery);
      activateSearchAreaControl();
    });
    map.on('zoom', () => {
      const currentZoom = parseInt(map.getZoom(), 10);

      speakZoom(currentZoom);
    });
    map.on('zoomend', () => {
      // Note: DO NOT call props.mapMoved() here
      // because zoomend is triggered by fitBounds.

      const currentZoom = parseInt(map.getZoom(), 10);

      if (lastZoom && parseInt(lastZoom, 10) > 3) {
        recordZoomEvent(lastZoom, currentZoom);
      }

      lastZoom = currentZoom;
      activateSearchAreaControl();
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

    const searchAreaControl = new SearchAreaControl(isMobile);
    mapInit.addControl(searchAreaControl);
    mapInit.addControl(
      new mapboxgl.NavigationControl({
        // Hide rotation control.
        showCompass: false,
      }),
      'top-left',
    );
    setSearchAreaPosition();
    const mapBoxLogo = document.querySelector(
      'a.mapboxgl-ctrl-logo.mapboxgl-compact',
    );
    if (mapBoxLogo) mapBoxLogo.setAttribute('tabIndex', -1);
    mapInit.on('load', () => {
      // set up listeners on the zoom-in and zoom-out buttons:
      document.querySelectorAll('.mapboxgl-ctrl > button').forEach(button =>
        button.addEventListener('click', () => {
          const screenreaderZoomElement = document.getElementById(
            zoomMessageDivID,
          );
          screenreaderZoomElement.innerText = '';
          props.mapMoved();
        }),
      );

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
                id={zoomMessageDivID}
                aria-live="assertive"
                className="sr-only"
              />
              <div
                style={{ width: '100%', maxHeight: '55vh', height: '55vh' }}
                id={mapboxGlContainer}
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
        <div id={zoomMessageDivID} aria-live="assertive" className="sr-only" />
        <div className="desktop-map-container" id={mapboxGlContainer} />
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
      window.removeEventListener('click', handleSearchArea);
      searchAreaSet = false;
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
