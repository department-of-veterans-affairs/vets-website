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

  const results = search.location.results.map((institution, index) => {
    const { name, city, state, distance } = institution;
    const letter = (index + 10).toString(36).toUpperCase();
    const miles = Number.parseFloat(distance).toFixed(2);

    const header = (
      <>
        <div className="vads-u-display--flex vads-u-padding-top--1">
          <span className="location-header-letter">{letter}</span>
          <span className="vads-u-padding-x--1">
            <strong>{miles} miles</strong>
          </span>
          <span>{`${city}, ${state}`}</span>
        </div>
        <div className="card-title-section">
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
      {search.location.count > 0 && (
        <div className={'location-search'}>
          <div className={'usa-width-one-third'}>
            <TuitionAndHousingEstimates />
            <SearchAccordion
              button={'Refine your search'}
              buttonLabel="Update results"
              buttonOnClick={() => {}}
            />
            <div className="location-search-results-container usa-grid vads-u-padding--1p5">
              <p>
                Showing <strong>{search.location.count} search results</strong>{' '}
                for '<strong>{search.query.location}</strong>'
              </p>
              <div className="location-search-results vads-l-row vads-u-flex-wrap--wrap">
                {results}
              </div>
            </div>
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
      )}
    </>
  );
}
