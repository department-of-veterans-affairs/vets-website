import PropTypes from 'prop-types';
import React from 'react';

function UseMyLocation({ geolocationInProgress, onClick }) {
  if (geolocationInProgress) {
    return (
      <div className="use-my-location-link">
        <va-icon icon="autorenew" size={3} />
        <span aria-live="assertive">Finding your location...</span>
      </div>
    );
  }

  // va-button cannot handle a clickable icon/image overlay
  return (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button
      onClick={onClick}
      type="button"
      className="use-my-location-link"
      aria-describedby="city-state-zip-text"
    >
      <va-icon icon="near_me" size={3} />
      Use my location
    </button>
  );
}

UseMyLocation.propTypes = {
  geolocationInProgress: PropTypes.bool,
  onClick: PropTypes.func,
};

export default UseMyLocation;
