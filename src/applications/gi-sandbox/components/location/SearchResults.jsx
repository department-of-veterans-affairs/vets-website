import React, { useEffect, useRef } from 'react';
import SearchResultCard from '../search/SearchResultCard';
import mapboxgl from 'mapbox-gl';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit } from '../../constants';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import SearchAccordion from '../SearchAccordion';
import { numberToLetter } from '../../utils/mapHelpers';

export default function SearchResults({ search }) {
  const { count, results } = search.location;
  const { location } = search.query;
  const map = useRef(null);
  const mapContainer = useRef(null);

  const setupMap = () => {
    if (map.current) return; // initialize map only once

    mapboxgl.accessToken = mapboxToken;

    const bounds = search.geocode ? search.geocode[0].bbox : null;

    const mapInit = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.longitude, MapboxInit.centerInit.latitude],
      bounds,
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

  const addMapMarker = (institution, letter) => {
    const { latitude, longitude } = institution;
    // const markerElement = buildMarker(letter);
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'location-letter';
    el.innerText = letter;

    new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map.current);
  };

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

  useEffect(
    () => {
      if (!map.current) return; // wait for map to initialize

      results.forEach((institution, index) => {
        const letter = numberToLetter(index + 1);
        addMapMarker(institution, letter);
      });
    },
    [results],
  );

  return (
    <>
      <div className={'location-search'}>
        <div className={'usa-width-one-third'}>
          {count > 0 && (
            <>
              <TuitionAndHousingEstimates />
              <SearchAccordion
                button={'Refine your search'}
                buttonLabel="Update results"
                buttonOnClick={() => {}}
              />
              <div className="location-search-results-container usa-grid vads-u-padding--1p5">
                <p>
                  Showing <strong>{count} search results</strong> for '
                  <strong>{location}</strong>'
                </p>
                <div className="location-search-results vads-l-row vads-u-flex-wrap--wrap">
                  {resultCards}
                </div>
              </div>
            </>
          )}
          {count === 0 && (
            <div>We didn't find any facilities near the location.</div>
          )}
          {count === null && (
            <div>
              Please enter a location (street, city, state, or postal code) then
              click search above to find institutions.
            </div>
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
