import React, { useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { getScrollOptions } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import SearchResultCard from '../../containers/SearchResultCard';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit, MAX_SEARCH_AREA_DISTANCE, TABS } from '../../constants';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import FilterYourResults from '../../containers/FilterYourResults';
import { createId } from '../../utils/helpers';
import {
  fetchSearchByLocationCoords,
  updateEligibilityAndFilters,
  mapChanged,
} from '../../actions';
import { connect } from 'react-redux';
import { getFiltersChanged } from '../../selectors/filters';
import MobileFilterControls from '../../components/MobileFilterControls';
import classNames from 'classnames';

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
  dispatchMapChanged,
}) {
  const { inProgress } = search;
  const { results } = search.location;
  const { location, streetAddress } = search.query;
  const map = useRef(null);
  const mapContainer = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [mapState, setMapState] = useState({ changed: false, distance: null });
  const [usedFilters, setUsedFilters] = useState(filtersChanged);
  const [cardResults, setCardResults] = useState(null);
  const [mobileTab, setMobileTab] = useState(LIST_TAB);
  const [markerClicked, setMarkerClicked] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

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

    mapboxgl.accessToken = mapboxToken;

    const mapInit = new mapboxgl.Map({
      container: mapContainer.current,
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
      if (mapContainer.current) {
        setupMap();
      }
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
      'location-search-results',
    );
    scroller.scrollTo(
      `${createId(name)}-result-card-placeholder`,
      getScrollOptions({
        containerId: 'location-search-results',
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
      if (smallScreen) {
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
    markers.current.push(currentMarkerElement);
  };

  /**
   * Takes results and puts them on the map
   * Excludes results that are not visible on the map when using "Search this area of the map"
   */
  useEffect(
    () => {
      markers.forEach(marker => marker.remove());
      setActiveMarker(null);

      let visibleResults = [];
      const mapMarkers = [];

      if (smallScreen) {
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
        if (streetAddress.searchString === location) {
          currentLocationMapMarker(locationBounds);
        }
        map.current.fitBounds(locationBounds, { padding: 20 });
      }

      setCardResults(visibleResults);
      setUsedFilters(getFiltersChanged(filters));
      setMarkers(mapMarkers);
    },
    [results, smallScreen, mobileTab],
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
        <span className="vads-u-padding-x--0p5 vads-u-font-size--sm">
          <strong>{miles} miles</strong>
        </span>
      </div>
    );

    return (
      <SearchResultCard
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

  /**
   * Renders the Eligibility and Filters accordions/buttons
   * @type {function(JSX.Element): (*|null)}
   */
  const eligibilityAndFilters = count => {
    const showTuitionAndFilters = count > 0 || usedFilters;

    if (showTuitionAndFilters) {
      return (
        <>
          {!smallScreen && (
            <>
              <TuitionAndHousingEstimates />
              <FilterYourResults />
            </>
          )}
          {smallScreen && (
            <MobileFilterControls className={'vads-u-margin-top--2'} />
          )}
        </>
      );
    }
    return null;
  };

  /**
   * Content for when no results are found with or without the use of filters
   * smallScreen count is different from desktop count
   * @param count
   * @return {JSX.Element}
   */
  const noResultsFound = count => {
    const noResultsNoFilters = count === 0 && !usedFilters;
    const noResultsWithFilters = count === 0 && usedFilters;

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
      <div className={tabClasses} onClick={() => setMobileTab(tabName)}>
        View {tabName}
      </div>
    );
  };

  /**
   * Content for how many search results are showing
   * smallScreen count is different from desktop count
   * @param count
   * @return {JSX.Element}
   */
  const searchResultsShowing = count => (
    <p>
      Showing <strong>{count} search results</strong> for '
      <strong>{location}</strong>'
    </p>
  );

  /**
   * Renders the showing message if not on smallScreen, and the result cards
   * smallScreen count is different from desktop count
   * @param count
   * @param visible
   * @return {boolean|JSX.Element}
   */
  const searchResults = (count, visible = true) => {
    if (count > 0) {
      const containerClassNames = classNames(
        'location-search-results-container',
        'usa-grid',
        'vads-u-padding--1p5',
        { 'vads-u-display--none': !visible },
      );
      const resultsClassnames = classNames('location-search-results', {
        'vads-l-row': !smallScreen && !location,
        'vads-u-flex-wrap--wrap': !smallScreen,
      });

      return (
        <div
          id="location-search-results-container"
          className={containerClassNames}
        >
          {!smallScreen && searchResultsShowing(count)}
          <div id="location-search-results" className={resultsClassnames}>
            {resultCards}
          </div>
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
    return (
      <div className={containerClassNames}>
        <map
          ref={mapContainer}
          id="mapbox-gl-container"
          aria-label="Find VA locations on an interactive map"
          aria-describedby="map-instructions"
          className="desktop-map-container"
          role="region"
        >
          {mapState.changed &&
            !smallScreen && (
              <div
                id="search-area-control-container"
                className={'mapboxgl-ctrl-top-center'}
              >
                <button
                  id="search-area-control"
                  className={'usa-button'}
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
  if (smallScreen) {
    return (
      <div className={'location-search vads-u-padding--1'}>
        {inProgress && <LoadingIndicator message="Loading search results..." />}
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
  const desktopCount = !cardResults ? null : cardResults.length;

  // Returns content setup for desktop screens
  return (
    <div className={'location-search vads-u-padding-top--1'}>
      <div className={'usa-width-one-third'}>
        {inProgress && <LoadingIndicator message="Loading search results..." />}
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
                {eligibilityAndFilters(desktopCount)}
                {searchResults(desktopCount)}
                {noResultsFound(desktopCount)}
              </>
            )}
          </>
        )}
      </div>

      <div className={'usa-width-two-thirds'}>{mapElement()}</div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchResults);
