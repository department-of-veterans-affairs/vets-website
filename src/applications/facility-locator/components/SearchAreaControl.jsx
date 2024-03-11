import React from 'react';
import { MAX_SEARCH_AREA } from '../constants';

const SearchAreaControl = ({
  isMobile,
  isEnabled,
  handleSearchArea,
  query,
}) => {
  const containerClass = isMobile
    ? 'mapboxgl-ctrl-bottom-center'
    : 'mapboxgl-ctrl-top-center';

  const buttonClass = `usa-button${!isEnabled ? ' fl-disabled' : ''}`;

  const handleClick = e => {
    if (e) e.preventDefault();
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
    <div id="search-area-control-container" className={containerClass}>
      <va-button
        uswds
        id="search-area-control"
        className={buttonClass}
        text={buttonLabel()}
        disabled={!isEnabled}
        ariaLive="assertive"
        onClick={handleClick}
      />
    </div>
  );
};

export default SearchAreaControl;
