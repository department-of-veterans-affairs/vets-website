import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionCard = ({ vendor, handleOnClick }) => {
  return (
    <div className="connect-device">
      <p>
        <h3>{vendor}</h3>
      </p>
      <p>
        <button
          onClick={handleOnClick}
          data-testid="fitbitConnectLink"
          onKeyDown={handleOnClick}
          className="connect-button"
        >
          Connect
        </button>
      </p>
    </div>
  );
};

DeviceConnectionCard.propTypes = {
  handleOnClick: PropTypes.func.isRequired,
  vendor: PropTypes.string.isRequired,
};
