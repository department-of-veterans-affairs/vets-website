import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxToken } from '../utils/mapboxToken';
import {
  clearSearchResults,
  fetchVAFacility,
  genBBoxFromAddress,
  searchWithBounds,
  updateSearchQuery,
} from '../actions';
import {
  facilitiesPpmsSuppressCommunityCare,
  facilitiesPpmsSuppressPharmacies,
  facilityLocatorPredictiveLocationSearch,
} from '../utils/selectors';

const FacilitiesMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(
    () => {
      mapboxgl.accessToken = mapboxToken;
      const initializeMap = (setMapInit, mapContainerInit) => {
        const mapInit = new mapboxgl.Map({
          container: mapContainerInit.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [0, 0],
          zoom: 5,
        });

        mapInit.on('load', () => {
          setMapInit(mapInit);
          mapInit.resize();
        });
      };

      if (!map) initializeMap(setMap, mapContainer);
    },
    [map],
  );

  return (
    <div
      ref={el => {
        mapContainer.current = el;
        return true;
      }}
    />
  );
};

const mapStateToProps = state => ({
  currentQuery: state.searchQuery,
  suppressPharmacies: facilitiesPpmsSuppressPharmacies(state),
  suppressCCP: facilitiesPpmsSuppressCommunityCare(state),
  usePredictiveGeolocation: facilityLocatorPredictiveLocationSearch(state),
  results: state.searchResult.results,
  pagination: state.searchResult.pagination,
  selectedResult: state.searchResult.selectedResult,
});
const mapDispatchToProps = {
  fetchVAFacility,
  updateSearchQuery,
  genBBoxFromAddress,
  searchWithBounds,
  clearSearchResults,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMap);
