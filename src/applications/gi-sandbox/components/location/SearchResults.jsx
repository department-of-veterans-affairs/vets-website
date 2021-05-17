import React, { useEffect, useState } from 'react';
import SearchResultCard from '../SearchResultCard';
import mapboxgl from 'mapbox-gl';
import { mapboxToken } from '../../utils/mapboxToken';
import { MapboxInit } from '../../constants';
import TuitionAndHousingEstimates from '../search/TuitionAndHousingEstimates';
import SearchAccordion from '../SearchAccordion';

export default function SearchResults({ search }) {
  const [map, setMap] = useState(null);
  const mapboxGlContainer = 'mapbox-gl-container';
  const setupMap = () => {
    const mapContainerElement = document.getElementById(mapboxGlContainer);
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
  useEffect(() => {
    setMap(setupMap());
  }, []); // <-- empty array means 'run once'

  return (
    <>
      {search.count > 0 && (
        <div>
          <div className={'usa-width-one-third'}>
            <TuitionAndHousingEstimates />
            <SearchAccordion
              button={'Refine your search'}
              buttonLabel="Update results"
              buttonOnClick={() => {}}
            />
            <div className="usa-grid vads-u-padding--1">
              <p>
                Showing <strong>{search.location.count} search results</strong>{' '}
                for '<strong>{search.query.location}</strong>'
              </p>
              <div className="vads-l-row vads-u-flex-wrap--wrap">
                {search.location.results.map(institution => (
                  <SearchResultCard
                    institution={institution}
                    key={institution.id}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={'usa-width-two-thirds'}>
            <map
              id={mapboxGlContainer}
              aria-label="Find VA locations on an interactive map"
              aria-describedby="map-instructions"
              className={'desktop-map-container'}
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
