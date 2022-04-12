import React from 'react';
import PropTypes from 'prop-types';

export const DeviceDisconnectionCard = ({ vendor, onClickHandler }) => {
  return (
    <div className="connect-device">
      <h3 className="vads-u-margin-y--0">{vendor}</h3>
      <p className="vads-u-margin-y--0">
        <button
          type="button"
          onClick={onClickHandler}
          data-testid={`${vendor}-disconnect-link`}
          id={`${vendor}-disconnect-link`}
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
  vendor: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
