import React from 'react';
import PropTypes from 'prop-types';

export const DeviceDisconnectionCard = ({ vendor, onClickHandler }) => {
  return (
    <div className="connect-device">
      <p>
        <h3>{vendor}</h3>
      </p>
      <p>
        <button
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
