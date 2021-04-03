import React from 'react';

const SearchAreaControl = ({
  isMobile,
  isEnabled,
  buttonLabel,
  handleSearchArea,
}) => {
  const containerClass = isMobile
    ? 'mapboxgl-ctrl-bottom-center'
    : 'mapboxgl-ctrl-top-center';

  const handleClick = e => {
    e.preventDefault();
    if (isEnabled) {
      handleSearchArea();
    }
  };

  return (
    <div
      id="search-area-control-container"
      aria-live="polite"
      className={containerClass}
    >
      <button
        id="search-area-control"
        className="usa-button"
        onClick={handleClick}
        disabled={!isEnabled}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default SearchAreaControl;
