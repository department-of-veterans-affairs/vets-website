import React from 'react';
import PropTypes from 'prop-types';

export const DeviceDisconnectionCard = ({ device, onClickHandler }) => {
  return (
    <div className="connect-device">
      <h3 className="vads-u-margin-y--0">
        {device.vendor}{' '}
        <span className="connected-header-text"> - Connected</span>{' '}
      </h3>
      <p className="vads-u-margin-y--0">
        <button
          type="button"
          onClick={onClickHandler}
          data-testid={`${device.key}-disconnect-link`}
          id={`${device.key}-disconnect-link`}
          onKeyDown={onClickHandler}
          className="usa-button-secondary"
        >
          Disconnect
        </button>
      </p>
    </div>
  );
};

DeviceDisconnectionCard.propTypes = {
  device: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
