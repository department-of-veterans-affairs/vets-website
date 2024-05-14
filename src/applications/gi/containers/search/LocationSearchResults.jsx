/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import environment from 'platform/utilities/environment';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import { connect } from 'react-redux';
import classNames from 'classnames';
import scrollTo from 'platform/utilities/ui/scrollTo';
import recordEvent from 'platform/monitoring/record-event';
import ResultCard from './ResultCard';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit, MAX_SEARCH_AREA_DISTANCE, TABS } from '../../constants';
import TuitionAndHousingEstimates from '../TuitionAndHousingEstimates';
import FilterYourResults from '../FilterYourResults';
import { createId } from '../../utils/helpers';
import {
  fetchSearchByLocationCoords,
  updateEligibilityAndFilters,
  mapChanged,
} from '../../actions';
import { getFiltersChanged } from '../../selectors/filters';
import MobileFilterControls from '../../components/MobileFilterControls';
// import FilterByLocation from './FilterByLocation';

const MILE_METER_CONVERSION_RATE = 1609.34;
const LIST_TAB = 'List';
const MAP_TAB = 'Map';

function LocationSearchResults({
  search,
  filters,
  preview,
  dispatchUpdateEligibilityAndFilters,
  dispatchFetchSearchByLocationCoords,
  filtersChanged,
  smallScreen,
  landscape,
  dispatchMapChanged,
}) {
  const { inProgress } = search;
  const { count, results } = search.location;
  const { location, streetAddress } = search.query;
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [mapState, setMapState] = useState({ changed: false, distance: null });
  const [usedFilters, setUsedFilters] = useState(filtersChanged);
  const [cardResults, setCardResults] = useState(null);
  const [dataReturned, setDataReturned] = useState(null);
  const [mobileTab, setMobileTab] = useState(LIST_TAB);
  const [markerClicked, setMarkerClicked] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const usingUserLocation = () => {
    const currentPositions = document.getElementsByClassName(
      'current-position',
    );

    if (currentPositions.length === 0) return false;
    if (myLocation === null) setMyLocation(search.query.location);
    if (search.query.location !== myLocation) return false;

    return true;
  };

  /**
   * When map is moved update distance from center to NorthEast corner
   */
  const updateMapState = () => {
    const mapBounds = map.current.getBounds();
    const newMapState = {
      distance:
        mapBounds.getNorthEast().distanceTo(mapBounds.getCenter()) /
        MILE_METER_CONVERSION_RATE,
      changed: true,
    };
    dispatchMapChanged(newMapState);
  };

  /**
   * When LocationSearchForm triggers a search it will set the value of changed to false disabling behavior
   * related to "Search this area of the map"
   */
  useEffect(
    () => {
      setMapState(search.query.mapState);
    },
    [search.query.mapState],
  );

  /**
   * Initialize map if the element is present
   */
  const setupMap = () => {
    if (map.current) return; // initialize map only once
    const container = document.getElementById('mapbox-gl-container');
    if (!container) return;

    mapboxgl.accessToken = mapboxToken;

    const mapInit = new mapboxgl.Map({
      container: 'mapbox-gl-container',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.longitude, MapboxInit.centerInit.latitude],
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

    mapInit.on('dragstart', () => {
      updateMapState();
    });

    mapInit.on('zoomend', e => {
      // Only trigger mapMoved and speakZoom for manual events,
      // e.g. zoom in/out button click, mouse wheel, etc.
      // which will have an originalEvent defined
      if (!e.originalEvent) {
        return;
      }

      updateMapState();
    });

    mapInit.on('dblclick', _e => {
      updateMapState();
    });

    map.current = mapInit;
  };

  /**
   * Initialize the map on load and if the mobileTab changes
   */
  useEffect(
    () => {
      setupMap();
    },
    [mobileTab],
  );

  /**
   * Used to exclude results from appearing in cards or as a marker when using "Search this area of the map" button
   *
   * @param institution
   * @return {boolean}
   */
  const markerIsVisible = institution => {
    const { latitude, longitude } = institution;
    const lngLat = new mapboxgl.LngLat(longitude, latitude);
    return (
      smallScreen ||
      landscape ||
      !mapState.changed ||
      map.current.getBounds().contains(lngLat)
    );
  };

  /**
   * Called when during the resulting action of clicking on a map marker either on desktop or smallScreen
   * Scrolls to the search result card within the Search results and collapses eligibility and filters accordions if
   * expanded
   * @param name
   */
  const mapMarkerClicked = name => {
    const locationSearchResults = document.getElementById(
      'location-search-results-container',
    );
    scrollTo(
      `${createId(name)}-result-card-placeholder`,
      getScrollOptions({
        containerId: 'location-search-results-container',
        offset: -locationSearchResults.getBoundingClientRect().top,
      }),
    );
    setActiveMarker(name);
    dispatchUpdateEligibilityAndFilters(
      { expanded: false },
      { expanded: false },
    );
  };

  /**
   * Used when a map marker is clicked
   * Using a useEffect since on smallScreen need to switch tabs first before scrolling to search result card
   * Both desktop and mobile will trigger this useEffect
   */
  useEffect(
    () => {
      if (markerClicked && (!smallScreen || mobileTab === LIST_TAB)) {
        mapMarkerClicked(markerClicked);
        setMarkerClicked(null);
        recordEvent({
          event: 'map-pin-click',
          'map-location': markerClicked,
        });
      }
    },
    [markerClicked],
  );

  /**
   * Adds a map marker to the map and includes in a LngLatBounds object if provided
   * Sets the map marker to have a "on click" event that scrolls to the corresponding result card
   * @param institution
   * @param index
   * @param locationBounds
   * @param mapMarkers
   */
  const addMapMarker = (institution, index, locationBounds, mapMarkers) => {
    const { latitude, longitude, name } = institution;
    const lngLat = new mapboxgl.LngLat(longitude, latitude);

    const markerElement = document.createElement('div');
    markerElement.className = 'location-letter-marker';
    markerElement.innerText = index + 1;

    const popup = new mapboxgl.Popup();
    popup.on('open', () => {
      if (smallScreen || landscape) {
        setMobileTab(LIST_TAB);
      }
      setMarkerClicked(name);
    });

    if (locationBounds) {
      locationBounds.extend(lngLat);
    }

    new mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map.current);

    mapMarkers.push(markerElement);
  };

  /**
   * Adds a map marker if user used "Find my location"
   * @param bounds
   */
  const currentLocationMapMarker = bounds => {
    if (!streetAddress.position.longitude || !streetAddress.position.latitude)
      return;

    const currentMarkerElement = document.createElement('div');
    currentMarkerElement.className = 'current-position';
    new mapboxgl.Marker(currentMarkerElement)
      .setLngLat([
        streetAddress.position.longitude,
        streetAddress.position.latitude,
      ])
      .addTo(map.current);
    bounds.extend([
      streetAddress.position.longitude,
      streetAddress.position.latitude,
    ]);
    markers.push(currentMarkerElement);
  };

  /**
   * Takes results and puts them on the map
   * Excludes results that are not visible on the map when using "Search this area of the map"
   */
  useEffect(
    () => {
      if (smallScreen || landscape) {
        map.current = null;
      }
      setupMap();
      markers.forEach(marker => marker.remove());
      setActiveMarker(null);

      let visibleResults = [];
      const mapMarkers = [];

      if (smallScreen || landscape) {
        visibleResults = results;
      }

      // reset map if no results found
      if (map.current && results.length === 0 && !mapState.changed) {
        map.current.setCenter([
          MapboxInit.centerInit.longitude,
          MapboxInit.centerInit.latitude,
        ]);
        map.current.zoomTo(MapboxInit.zoomInit, { duration: 300 });
      }

      // wait for map to initialize or no results are returned
      if (!map.current || results.length === 0) {
        setUsedFilters(getFiltersChanged(filters));
        setCardResults(visibleResults);
        setMarkers(mapMarkers);
        return;
      }

      const locationBounds = !mapState.changed
        ? new mapboxgl.LngLatBounds()
        : null;

      visibleResults = results.filter(institution =>
        markerIsVisible(institution),
      );
      visibleResults.forEach((institution, index) =>
        addMapMarker(institution, index, locationBounds, mapMarkers),
      );

      if (locationBounds) {
        if (
          location &&
          location !== '' &&
          streetAddress.searchString &&
          streetAddress.searchString !== '' &&
          streetAddress.searchString === location
        ) {
          currentLocationMapMarker(locationBounds);
        }
        map.current.fitBounds(locationBounds, { padding: 20 });
      }

      setDataReturned(true);
      setCardResults(visibleResults);
      setUsedFilters(getFiltersChanged(filters));
      setMarkers(mapMarkers);
    },
    [results, smallScreen, landscape, mobileTab],
  );

  /**
   * Creates result cards for display
   */
  const resultCards = cardResults?.map((institution, index) => {
    const { distance, name } = institution;
    const miles = Number.parseFloat(distance).toFixed(2);

    const header = (
      <div className="location-header vads-u-display--flex vads-u-padding-top--1 vads-u-padding-bottom--2">
        <span className="location-letter vads-u-font-size--sm">
          {index + 1}
        </span>
        {usingUserLocation() && (
          <span className="vads-u-padding-x--0p5 vads-u-font-size--sm">
            <strong>{miles} miles</strong>
          </span>
        )}
      </div>
    );

    return (
      <ResultCard
        institution={institution}
        location
        header={header}
        active={activeMarker === name}
        version={preview.version}
        key={institution.facilityCode}
      />
    );
  });

  /**
   * Called when user uses "Search this area of the map"
   * @param e
   */
  const searchArea = e => {
    if (e) {
      e.preventDefault();
    }
    updateMapState();
    recordEvent({
      event: `Search this area of map clicked`,
    });
    dispatchFetchSearchByLocationCoords(
      search.query.location,
      map.current.getCenter().toArray(),
      mapState.distance,
      filters,
      preview.version,
    );
  };

  /**
   * Triggers a search for "Search this area of the map" when the "Update results" button in "Filter your results"
   * is clicked
   */
  useEffect(
    () => {
      if (
        !search.loadFromUrl &&
        filters.search &&
        search.tab === TABS.location &&
        search.query.mapState.changed
      ) {
        searchArea(null);
      }
    },
    [filters.search],
  );

  useEffect(
    () => {
      focusElement('#location-search-results-count');
      // Avoid blank searches or double events
      if (location && count !== null) {
        recordEvent({
          event: 'view_search_results',
          'search-page-path': document.location.pathname,
          'search-query': '[redacted]',
          'search-results-total-count': count,
          'search-results-total-pages': undefined,
          'search-selection': 'GIBCT',
          'search-typeahead-enabled': false,
          'search-location': 'Location',
          'sitewide-search-app-used': false,
          'type-ahead-option-keyword-selected': undefined,
          'type-ahead-option-position': undefined,
          'type-ahead-options-list': undefined,
          'type-ahead-options-count': undefined,
        });
      }
    },
    [results],
  );

  /**
   * Renders the Eligibility and Filters accordions/buttons
   * @type {function(JSX.Element): (*|null)}
   */
  const eligibilityAndFilters = cnt => {
    const showTuitionAndFilters = cnt > 0 || usedFilters;

    if (showTuitionAndFilters) {
      return (
        <>
          {!smallScreen && (
            <>
              <TuitionAndHousingEstimates />
              {environment.isProduction() && (
                <FilterYourResults searchType="location" />
              )}
              {!environment.isProduction() && (
                <FilterYourResults searchType="location" />
              )}
              {/* {!environment.isProduction() && <FilterByLocation />} */}
            </>
          )}
          {environment.isProduction()
            ? (smallScreen || landscape) && (
                <MobileFilterControls className="vads-u-margin-top--2" />
              )
            : smallScreen &&
              !landscape &&
              results.length > 0 && (
                <MobileFilterControls className="vads-u-margin-top--2" />
              )}
        </>
      );
    }
    return null;
  };

  /**
   * Content for when no results are found with or without the use of filters
   * smallScreen count is different from desktop count
   * @param cnt
   * @return {JSX.Element}
   */
  const noResultsFound = cnt => {
    const noResultsNoFilters = cnt === 0 && !usedFilters;
    const noResultsWithFilters = cnt === 0 && usedFilters;

    return (
      <>
        {noResultsNoFilters && (
          <div>
            <p>We didn’t find any institutions based on your search.</p>
            <p>
              <strong>For better results:</strong>
            </p>
            <ul>
              <li>
                <strong>Zoom in or out</strong> to view a different area of the
                map, or
              </li>
              <li>
                <strong>Move the map</strong> to a different area
              </li>
            </ul>
            <p>
              Then click the <strong>"Search this area of map"</strong> button.
            </p>
            <p>
              If we still haven’t found any facilities near you,{' '}
              <strong>please enter a different search term</strong> (street,
              city, state, or postal code).
            </p>
          </div>
        )}
        {noResultsWithFilters && (
          <div>
            We didn’t find any institutions near this location based on the
            filters you’ve applied. Please update the filters and search again.
          </div>
        )}
      </>
    );
  };

  /**
   * smallScreen tabs for List and Map views
   * @param tabName
   * @return {JSX.Element}
   */
  const getTab = tabName => {
    const activeTab = tabName === mobileTab;
    const tabClasses = classNames(
      {
        'active-results-tab': activeTab,
        'vads-u-color--gray-dark': activeTab,
        'vads-u-background-color--white': activeTab,
        'inactive-results-tab': !activeTab,
        'vads-u-color--gray-medium': !activeTab,
        'vads-u-background-color--gray-light-alt': !activeTab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-l-grid-container',
      'vads-u-padding-y--1',
      `${tabName.toLowerCase()}-results-tab`,
    );

    return (
      <div
        className={tabClasses}
        onClick={() => setMobileTab(tabName)}
        onKeyPress={() => setMobileTab(tabName)}
        tabIndex={-1}
        role="button"
      >
        View {tabName}
      </div>
    );
  };

  /**
   * Content for how many search results are showing
   * smallScreen count is different from desktop count
   * @param cnt
   * @return {JSX.Element}
   */
  const searchResultsShowing = cnt => (
    <p id="location-search-results-count">
      Showing {cnt} search results for "<strong>{location}</strong>"
    </p>
  );

  /**
   * Renders the result cards
   * smallScreen count is different from desktop count
   * @param cnt
   * @param visible
   * @return {boolean|JSX.Element}
   */
  const searchResults = (cnt, visible = true) => {
    if (cnt > 0) {
      const containerClassNames = classNames(
        'location-search-results-container',
        'usa-grid',
        'vads-u-padding--1p5',
        {
          'vads-u-display--none': !visible,
          'vads-u-flex-wrap--wrap': !smallScreen,
        },
      );

      return (
        <div
          id="location-search-results-container"
          className={containerClassNames}
        >
          {resultCards}
        </div>
      );
    }
    return null;
  };

  const areaSearchWithinBounds = mapState.distance <= MAX_SEARCH_AREA_DISTANCE;
  const areaSearchLabel = areaSearchWithinBounds
    ? 'Search this area of the map'
    : 'Zoom in to search';

  /**
   * Creates the map element container and if not on smallScreen the areaSearch button
   * @type {function(JSX.Element=): *}
   */
  const mapElement = (visible = true) => {
    const containerClassNames = classNames({
      'vads-u-display--none': !visible,
    });
    const isMobileDevice = smallScreen || landscape;
    return (
      <div
        tabIndex="0"
        role="region"
        className={containerClassNames}
        aria-label="Find VA locations on an interactive map. Tab again to interact with map"
      >
        <map
          id="mapbox-gl-container"
          className="desktop-map-container"
          role="region"
        >
          {mapState.changed &&
            !isMobileDevice && (
              <div
                id="search-area-control-container"
                className="mapboxgl-ctrl-top-center"
              >
                <button
                  type="button"
                  id="search-area-control"
                  className="usa-button"
                  onClick={searchArea}
                  disabled={!areaSearchWithinBounds}
                >
                  {areaSearchLabel}
                </button>
              </div>
            )}
        </map>
      </div>
    );
  };

  const hasSearchLatLong = search.query.latitude && search.query.longitude;

  // Results shouldn't be filtered out on mobile because "Search this area of the map" is disabled
  const smallScreenCount = search.location.count;

  // returns content ordered and setup for smallScreens
  if (smallScreen || landscape) {
    return (
      <div className="location-search vads-u-padding--1">
        {inProgress && (
          <va-loading-indicator message="Loading search results..." />
        )}
        {!inProgress && (
          <>
            <div>
              {eligibilityAndFilters(smallScreenCount)}
              {noResultsFound(smallScreenCount)}
            </div>
            {smallScreenCount > 0 && (
              <>
                <div className="vads-u-font-size--base vads-u-padding-top--1p5">
                  {searchResultsShowing(smallScreenCount)}
                </div>
                <div className="vads-u-display--flex tab-form">
                  {getTab(LIST_TAB)}
                  {getTab(MAP_TAB)}
                </div>
                <hr className="vads-u-margin-y--1p5" />
                {searchResults(smallScreenCount, mobileTab === LIST_TAB)}
                {mapElement(mobileTab === MAP_TAB)}
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // Only needed on desktop as can do "Search this area of the map" which causes differences in count between what is
  // returned and what is visible
  const desktopCount = dataReturned ? cardResults.length : 0;

  // Returns content setup for desktop screens
  return (
    <div className="location-search vads-u-padding-top--1">
      <div className="usa-width-one-third">
        &nbsp;
        {inProgress && (
          <va-loading-indicator message="Loading search results..." />
        )}
        {!inProgress && (
          <>
            {!hasSearchLatLong && (
              <div>
                Please enter a location (street, city, state, or postal code)
                then click search above to find institutions.
              </div>
            )}
            {hasSearchLatLong && (
              <>
                {dataReturned && searchResultsShowing(desktopCount)}
                {eligibilityAndFilters(desktopCount)}
                {searchResults(desktopCount)}
                {noResultsFound(desktopCount)}
              </>
            )}
          </>
        )}
      </div>

      <div className="usa-width-two-thirds">{mapElement()}</div>
    </div>
  );
}

const mapStateToProps = state => ({
  search: state.search,
  filters: state.filters,
  preview: state.preview,
  filtersChanged: getFiltersChanged(state.filters),
});

const mapDispatchToProps = {
  dispatchUpdateEligibilityAndFilters: updateEligibilityAndFilters,
  dispatchFetchSearchByLocationCoords: fetchSearchByLocationCoords,
  dispatchMapChanged: mapChanged,
};

LocationSearchResults.propTypes = {
  dispatchFetchSearchByLocationCoords: PropTypes.func,
  dispatchMapChanged: PropTypes.func,
  dispatchUpdateEligibilityAndFilters: PropTypes.func,
  filters: PropTypes.object,
  filtersChanged: PropTypes.bool,
  preview: PropTypes.object,
  search: PropTypes.object,
  smallScreen: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchResults);
