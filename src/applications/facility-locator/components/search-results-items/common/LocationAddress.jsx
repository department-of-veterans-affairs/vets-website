import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from 'platform/utilities/facilities-and-mapbox';

const LocationAddress = ({ location }) => {
  const addressArray = buildAddressArray(location);

  if (addressArray.length === 0) {
    return (
      <p>
        <strong>Address: </strong>
        Contact for Information
      </p>
    );
  }

  return (
    <p data-testid="facility-result-address">
      {[].concat(...addressArray.map(e => [<br key={e} />, e])).slice(1)}
    </p>
  );
};

LocationAddress.propTypes = {
  location: PropTypes.object,
};

export default LocationAddress;
