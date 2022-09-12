import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

export const DeviceConnectionCard = ({ device }) => {
  return (
    <div className="connect-device">
      <h3 className="vads-u-margin-y--0">{device.name}</h3>
      <p className="vads-u-margin-y--0">
        <va-link
          active
          role="link"
          data-testid={`${device.key}-connect-link`}
          id={`${device.key}-connect-link`}
          className="connect-button"
          href={`${environment.API_URL}/dhp_connected_devices${device.authUrl}`}
          aria-label={`Connect ${device.name}`}
          text="Connect"
        />
      </p>
    </div>
  );
};

DeviceConnectionCard.propTypes = {
  device: PropTypes.object.isRequired,
};
