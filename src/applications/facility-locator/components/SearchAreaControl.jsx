import React from 'react';
import { SearchAreaControlTypes } from '../types';
import { MAX_SEARCH_AREA } from '../constants';

const SearchAreaControl = ({
  handleSearchArea,
  isEnabled,
  isMobile,
  mobileMapUpdateEnabled,
  query,
  selectMobileMapPin,
}) => {
  const containerClass = () => {
    const mobileClass = isMobile
      ? 'mapboxgl-ctrl-bottom-center'
      : 'mapboxgl-ctrl-top-center';
    const radiusClass =
      query?.currentRadius > MAX_SEARCH_AREA
        ? 'mapboxgl-zoomed-out'
        : 'mapboxgl-zoomed-in';

    return `${mobileClass} ${radiusClass}`;
  };

  const buttonClass = `${!isEnabled ? ' fl-disabled' : ''}`;

  const handleClick = e => {
    if (e) e.preventDefault();

    if (isMobile && mobileMapUpdateEnabled) {
      selectMobileMapPin(null);
    }

    if (isEnabled) {
      handleSearchArea();
    }
  };

  const buttonLabel = () => {
    return query?.currentRadius > MAX_SEARCH_AREA
      ? 'Zoom in to search'
      : 'Search this area of the map';
  };

  return (
    <div id="search-area-control-container" className={containerClass()}>
      <va-button
        data-testid="search-area-control"
        key={`search-area-control-${isEnabled}`}
        id="search-area-control"
        class={buttonClass}
        text={buttonLabel()}
        disabled={!isEnabled}
        ariaLive="assertive"
        onClick={handleClick}
        disable-analytics
      />
    </div>
  );
};

SearchAreaControl.propTypes = SearchAreaControlTypes;

export default SearchAreaControl;
