import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionCard = ({ vendor, onClickHandler }) => {
  return (
    <div className="connect-device">
      <h3 className="vads-u-margin-y--0">{vendor}</h3>
      <p className="vads-u-margin-y--0">
        <a
          onClick={onClickHandler}
          data-testid={`${vendor}-connect-link`}
          id={`${vendor}-connect-link`}
          onKeyDown={onClickHandler}
          className="connect-button"
          href="http://localhost:3000/dhp_connected_devices/fitbit"
        >
          Connect
        </a>
      </p>
    </div>
  );
};

DeviceConnectionCard.propTypes = {
  vendor: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
