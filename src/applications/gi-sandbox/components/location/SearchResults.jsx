import React, { useEffect, useState } from 'react';
import SearchResultCard from '../SearchResultCard';
import mapboxgl from 'mapbox-gl';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit } from '../../constants';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import SearchAccordion from '../SearchAccordion';

export default function SearchResults({ search }) {
  const [map, setMap] = useState(null);
  const mapboxGlContainer = 'mapbox-gl-container';

  const setupMap = () => {
    mapboxgl.accessToken = mapboxToken;
    const mapInit = new mapboxgl.Map({
      container: mapboxGlContainer,
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
    return mapInit;
  };

  useEffect(() => {
    if (document.getElementById(mapboxGlContainer)) {
      setMap(setupMap());
    }
  }, []); // <-- empty array means 'run once'

  /**
   * Convert index number to A to Z and then AA to ZZ when index is higher than 25
   * @param number
   * @returns {string}
   */
  const numberToLetter = number => {
    // starts at 0 count
    const letter0 = ((number % 26) + 10).toString(36).toUpperCase();
    const divisor = Math.floor(number / 26);
    if (divisor >= 1) {
      // starts at 1 count
      const letter1 = (divisor + 9).toString(36).toUpperCase();
      return `${letter1}${letter0}`;
    }
    return letter0;
  };

  const results = search.location.results.map((institution, index) => {
    const { name, city, state, distance } = institution;
    const miles = Number.parseFloat(distance).toFixed(2);

    const header = (
      <>
        <div className="location-header vads-u-display--flex vads-u-padding-top--1">
          <span className="location-header-letter vads-u-font-size--sm">
            {numberToLetter(index)}
          </span>
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
        key={institution.id}
        header={header}
        location
      />
    );
  });

  return (
    <>
      <div className={'location-search'}>
        <div className={'usa-width-one-third'}>
          {search.location.count > 0 && (
            <>
              <TuitionAndHousingEstimates />
              <SearchAccordion
                button={'Refine your search'}
                buttonLabel="Update results"
                buttonOnClick={() => {}}
              />
              <div className="location-search-results-container usa-grid vads-u-padding--1p5">
                <p>
                  Showing{' '}
                  <strong>{search.location.count} search results</strong> for '
                  <strong>{search.query.location}</strong>'
                </p>
                <div className="location-search-results vads-l-row vads-u-flex-wrap--wrap">
                  {results}
                </div>
              </div>
            </>
          )}
          {search.location.count === 0 && (
            <div>We didn't find any facilities near you.</div>
          )}
          {search.location.count === null && (
            <div>
              Please enter a location (street, city, state, or postal code) then
              click search above to find institutions.
            </div>
          )}
        </div>

        <div className={'usa-width-two-thirds'}>
          <map
            id={mapboxGlContainer}
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
