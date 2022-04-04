import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionCard = ({ vendor, onClickHandler }) => {
  return (
    <div className="connect-device">
      <p>
        <h3>{vendor}</h3>
        <button
          onClick={onClickHandler}
          data-testid={`${vendor}-connect-link`}
          id={`${vendor}-connect-link`}
          onKeyDown={onClickHandler}
          className="connect-button"
        >
          Connect
        </button>
      </p>
    </div>
  );
};

DeviceConnectionCard.propTypes = {
  vendor: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
