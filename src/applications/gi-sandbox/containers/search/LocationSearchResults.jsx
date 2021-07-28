import React, { useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { getScrollOptions } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import SearchResultCard from '../../containers/SearchResultCard';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit, MAX_SEARCH_AREA_DISTANCE } from '../../constants';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import FilterYourResults from '../../containers/FilterYourResults';
import { numberToLetter, createId } from '../../utils/helpers';
import {
  fetchSearchByLocationCoords,
  updateEligibilityAndFilters,
} from '../../actions';
import { connect } from 'react-redux';
import { getFiltersChanged } from '../../selectors/filters';
import MobileFilterControls from '../../components/MobileFilterControls';

const MILE_METER_CONVERSION_RATE = 1609.34;

function LocationSearchResults({
  search,
  filters,
  preview,
  dispatchUpdateEligibilityAndFilters,
  dispatchFetchSearchByLocationCoords,
  filtersChanged,
  smallScreen,
}) {
  const { inProgress } = search;
  const { results } = search.location;
  const { location, streetAddress } = search.query;
  const map = useRef(null);
  const mapContainer = useRef(null);
  const markers = useRef([]);
  const [mapState, setMapState] = useState({ changed: false, distance: null });
  const [usedFilters, setUsedFilters] = useState(filtersChanged);
  const [cardResults, setCardResults] = useState(null);

  const updateMapState = () => {
    const mapBounds = map.current.getBounds();
    setMapState({
      distance:
        mapBounds.getNorthEast().distanceTo(mapBounds.getCenter()) /
        MILE_METER_CONVERSION_RATE,
      changed: true,
    });
  };

  const setupMap = () => {
    if (map.current) return; // initialize map only once

    mapboxgl.accessToken = mapboxToken;

    const mapInit = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.longitude, MapboxInit.centerInit.latitude],
      zoom: MapboxInit.zoomInit,
      scrollZoom: { around: 'center' },
      touchZoomRotate: { around: 'center' },
      doubleClickZoom: false,
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

    mapInit.on('dblclick', e => {
      map.current.easeTo(
        {
          duration: 300,
          zoom: map.current.getZoom() + (e.originalEvent.shiftKey ? -1 : 1),
          around: map.current.getCenter(),
        },
        { originalEvent: e.originalEvent },
      );
      updateMapState();
    });

    map.current = mapInit;
  };

  useEffect(() => {
    if (mapContainer.current) {
      setupMap();
    }
  }, []); // <-- empty array means 'run once'

  /**
   * Used to exclude results from appearing in cards or as a marker when using "Search area" button
   *
   * @param institution
   * @return {boolean}
   */
  const markerIsNotVisible = institution => {
    const { latitude, longitude } = institution;
    const lngLat = new mapboxgl.LngLat(longitude, latitude);

    return mapState.changed && !map.current.getBounds().contains(lngLat);
  };

  const addMapMarker = (institution, index, locationBounds) => {
    const { latitude, longitude, name } = institution;
    const lngLat = new mapboxgl.LngLat(longitude, latitude);

    if (markerIsNotVisible(institution)) return false;

    const letter = numberToLetter(index + 1);

    const markerElement = document.createElement('div');
    markerElement.className = 'location-letter-marker';
    markerElement.innerText = letter;

    const popup = new mapboxgl.Popup();
    popup.on('open', () => {
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
      dispatchUpdateEligibilityAndFilters(
        { expanded: false },
        { expanded: false },
      );
    });

    if (locationBounds) {
      locationBounds.extend(lngLat);
    }

    new mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map.current);

    markers.current.push(markerElement);

    return true;
  };

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

  useEffect(
    () => {
      markers.current.forEach(marker => marker.remove());
      let visibleResults = [];

      if (!map.current || results.length === 0) {
        if (!mapState.changed) {
          map.current.setCenter([
            MapboxInit.centerInit.longitude,
            MapboxInit.centerInit.latitude,
          ]);
          map.current.zoomTo(MapboxInit.zoomInit, { duration: 300 });
        }
        setMapState({ changed: false, distance: null });
        setUsedFilters(getFiltersChanged(filters));
        setCardResults(visibleResults);
        return;
      } // wait for map to initialize

      const locationBounds = !mapState.changed
        ? new mapboxgl.LngLatBounds()
        : null;

      visibleResults = results.filter((institution, index) => {
        return addMapMarker(institution, index, locationBounds);
      });

      if (locationBounds) {
        if (streetAddress.searchString === location) {
          currentLocationMapMarker(locationBounds);
        }
        map.current.fitBounds(locationBounds, { padding: 20 });
      }

      setUsedFilters(getFiltersChanged(filters));
      setCardResults(visibleResults);
      setMapState({ changed: false, distance: null });
    },
    [results],
  );

  const resultCards = cardResults?.map((institution, index) => {
    const { distance } = institution;
    const miles = Number.parseFloat(distance).toFixed(2);
    const letter = numberToLetter(index + 1);

    const header = (
      <div className="location-header vads-u-display--flex vads-u-padding-top--1 vads-u-padding-bottom--2">
        <span className="location-letter vads-u-font-size--sm">{letter}</span>
        <span className="vads-u-padding-x--0p5 vads-u-font-size--sm">
          <strong>{miles} miles</strong>
        </span>
      </div>
    );

    return (
      <div key={institution.facilityCode}>
        <SearchResultCard institution={institution} location header={header} />
      </div>
    );
  });

  const searchArea = e => {
    e.preventDefault();
    dispatchFetchSearchByLocationCoords(
      search.query.location,
      map.current.getCenter().toArray(),
      mapState.distance,
      filters,
      preview.version,
    );
  };

  const areaSearchWithinBounds = mapState.distance <= MAX_SEARCH_AREA_DISTANCE;
  const areaSearchLabel = areaSearchWithinBounds
    ? 'Search this area of the map'
    : 'Zoom in to search';
  const count = !cardResults ? null : cardResults.length;

  return (
    <>
      <div className={'location-search vads-u-padding-top--1'}>
        <div className={'usa-width-one-third'}>
          {inProgress && (
            <LoadingIndicator message="Loading search results..." />
          )}
          {!inProgress && (
            <>
              {search.location.count === null && (
                <div>
                  Please enter a location (street, city, state, or postal code)
                  then click search above to find institutions.
                </div>
              )}
              {search.location.count !== null &&
                (count > 0 || usedFilters) && (
                  <>
                    {!smallScreen && (
                      <>
                        <TuitionAndHousingEstimates />
                        <FilterYourResults />
                      </>
                    )}
                    {smallScreen && (
                      <MobileFilterControls
                        className={'vads-u-margin-top--2'}
                      />
                    )}
                    {count > 0 && (
                      <div
                        id="location-search-results-container"
                        className="location-search-results-container usa-grid vads-u-padding--1p5"
                      >
                        <p>
                          Showing <strong>{count} search results</strong> for '
                          <strong>{location}</strong>'
                        </p>
                        <div
                          id="location-search-results"
                          className="location-search-results vads-l-row vads-u-flex-wrap--wrap"
                        >
                          {resultCards}
                        </div>
                      </div>
                    )}
                  </>
                )}
              {count === 0 &&
                !usedFilters && (
                  <div>
                    <p>We didn't find any institutions based on your search.</p>
                    <p>
                      <strong>For better results:</strong>
                    </p>
                    <ul>
                      <li>
                        <strong>Zoom in or out</strong> to view a different area
                        of the map, or
                      </li>
                      <li>
                        <strong>Move the map</strong> to a different area
                      </li>
                    </ul>
                    <p>
                      Then click the <strong>"Search this area of map"</strong>{' '}
                      button.
                    </p>
                    <p>
                      If we still haven't found any facilities near you,{' '}
                      <strong>please enter a different search term</strong>{' '}
                      (street, city, state, or postal code).
                    </p>
                  </div>
                )}
              {count === 0 &&
                usedFilters && (
                  <div>
                    We didn't find any institutions near this location based on
                    the filters you've applied. Please update the filters and
                    search again.
                  </div>
                )}
            </>
          )}
        </div>

        <div className={'usa-width-two-thirds'}>
          <map
            ref={mapContainer}
            id="mapbox-gl-container"
            aria-label="Find VA locations on an interactive map"
            aria-describedby="map-instructions"
            className={'desktop-map-container'}
            role="region"
          >
            {mapState.changed && (
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
      </div>
    </>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchResults);
