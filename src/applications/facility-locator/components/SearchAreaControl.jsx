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

  const buttonClass = `usa-button${!isEnabled ? ' fl-disabled' : ''}`;

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
        className={buttonClass}
        onClick={handleClick}
        disabled={!isEnabled}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default SearchAreaControl;
