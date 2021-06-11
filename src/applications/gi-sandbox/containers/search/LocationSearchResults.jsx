import React, { useEffect, useRef } from 'react';
import { scroller } from 'react-scroll';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { getScrollOptions } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import SearchResultCard from '../../containers/SearchResultCard';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit } from '../../constants';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import RefineYourSearch from '../../containers/RefineYourSearch';
import { numberToLetter, createId } from '../../utils/helpers';
import { updateEligibilityAndFilters } from '../../actions';
import { connect } from 'react-redux';

function LocationSearchResults({
  search,
  dispatchUpdateEligibilityAndFilters,
}) {
  const { inProgress } = search;
  const { count, results } = search.location;
  const { location } = search.query;
  const map = useRef(null);
  const mapContainer = useRef(null);
  const markers = useRef([]);

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

    map.current = mapInit;
  };

  useEffect(() => {
    if (mapContainer.current) {
      setupMap();
    }
  }, []); // <-- empty array means 'run once'

  const addMapMarker = (institution, index, locationBounds) => {
    const { latitude, longitude, name } = institution;
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

    locationBounds.extend(new mapboxgl.LngLat(longitude, latitude));
    new mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map.current);

    markers.current.push(markerElement);
  };

  useEffect(
    () => {
      markers.current.forEach(marker => marker.remove());

      if (!map.current || results.length === 0) return; // wait for map to initialize

      const locationBounds = new mapboxgl.LngLatBounds();

      results.forEach((institution, index) => {
        addMapMarker(institution, index, locationBounds);
      });

      map.current.fitBounds(locationBounds, { padding: 20 });
    },
    [results],
  );

  const resultCards = results.map((institution, index) => {
    const { name, city, state, distance } = institution;
    const miles = Number.parseFloat(distance).toFixed(2);
    const letter = numberToLetter(index + 1);

    const header = (
      <>
        <div className="location-header vads-u-display--flex vads-u-padding-top--1">
          <span className="location-letter vads-u-font-size--sm">{letter}</span>
          <span className="vads-u-padding-x--0p5 vads-u-font-size--sm">
            <strong>{miles} miles</strong>
          </span>
          <span className="vads-u-font-size--sm">{`${city}, ${state}`}</span>
        </div>
        <div>
          <h3 className="vads-u-margin-top--2">{name}</h3>
        </div>
      </>
    );

    return (
      <SearchResultCard
        institution={institution}
        key={institution.facilityCode}
        header={header}
        location
      />
    );
  });

  const eligibilityAndFilters = location !== '' && location !== undefined;
  const startMessage = count === null && !eligibilityAndFilters;
  const noResultsFound = count === 0;

  return (
    <>
      <div className={'location-search vads-u-padding-top--1'}>
        <div className={'usa-width-one-third'}>
          {inProgress && (
            <LoadingIndicator message="Loading search results..." />
          )}
          {!inProgress && (
            <>
              {startMessage && (
                <div>
                  Please enter a location (street, city, state, or postal code)
                  then click search above to find institutions.
                </div>
              )}
              {eligibilityAndFilters && (
                <>
                  <TuitionAndHousingEstimates />
                  <RefineYourSearch />
                  {!noResultsFound && (
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
              {noResultsFound && (
                <div>We didn't find any institutions near the location.</div>
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
            <div
              id="search-area-control-container"
              className={'mapboxgl-ctrl-top-center'}
            >
              <button
                id="search-area-control"
                className={'usa-button'}
                onClick={() => {}}
                aria-live="assertive"
              >
                Search this area of the map
              </button>
            </div>
          </map>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  search: state.search,
});

const mapDispatchToProps = {
  dispatchUpdateEligibilityAndFilters: updateEligibilityAndFilters,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchResults);
