import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import SearchAreaControl from './SearchAreaControl';

// renderMap does not consider progressive disclosure flipper internally
function RenderMap(
  {
    currentQuery,
    handleSearchArea,
    isSearching,
    mapboxGlContainer,
    map,
    mobile,
    results,
    searchAreaButtonEnabled,
    shouldRenderSearchArea,
    smallDesktop,
    zoomMessageDivID,
  },
  ref,
) {
  useEffect(
    () => {
      if (map) {
        map.resize();
      }
    },
    [map],
  );
  const speakMapInstructions = () => {
    const mapInstructionsElement = document.getElementById('map-instructions');

    if (mapInstructionsElement) {
      mapInstructionsElement.innerText =
        'Search areas on the map up to a maximum of 500 miles. ' +
        'Zoom in or out using the zoom in and zoom out buttons. ' +
        'Use a keyboard to navigate up, down, left, and right in the map.';
    }
  };

  return (
    <>
      {!isSearching && (results?.length || 0) > 0 ? (
        <h2 className="sr-only">Map of Results</h2>
      ) : null}
      <div id={zoomMessageDivID} aria-live="polite" className="sr-only" />
      <p className="sr-only" id="map-instructions" aria-live="assertive" />
      <div
        id={mapboxGlContainer}
        role="application"
        aria-label="Find VA locations on an interactive map"
        aria-describedby="map-instructions"
        onFocus={() => speakMapInstructions()}
        ref={ref}
        className={
          mobile
            ? 'mobile'
            : `${smallDesktop ? 'desktop' : 'tablet'}-map-container`
        }
      >
        {shouldRenderSearchArea && (
          <SearchAreaControl
            isMobile={mobile}
            isEnabled={searchAreaButtonEnabled}
            handleSearchArea={handleSearchArea}
            query={currentQuery}
          />
        )}
      </div>
    </>
  );
}

RenderMap.propTypes = {
  currentQuery: PropTypes.object,
  handleSearchArea: PropTypes.func,
  isSearching: PropTypes.bool,
  map: PropTypes.object,
  mapboxGlContainer: PropTypes.string,
  mobile: PropTypes.bool,
  results: PropTypes.array,
  searchAreaButtonEnabled: PropTypes.bool,
  shouldRenderSearchArea: PropTypes.bool,
  smallDesktop: PropTypes.bool,
  zoomMessageDivID: PropTypes.string,
};

export default forwardRef(RenderMap);
