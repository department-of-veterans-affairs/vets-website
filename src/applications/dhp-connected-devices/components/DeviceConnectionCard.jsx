import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionCard = ({ vendor, onClickHandler }) => {
  return (
    <div className="connect-device">
      <h3 className="vads-u-margin-y--0">{vendor}</h3>
      <p className="vads-u-margin-y--0">
        <button
          type="button"
          onClick={onClickHandler}
          data-testId={`${vendor}-connect-link`}
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
