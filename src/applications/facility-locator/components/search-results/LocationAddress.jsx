import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/facilityAddress';

const LocationAddress = ({ location }) => {
  const addressArray = buildAddressArray(location);

  if (addressArray.length === 0) {
    return (
      <dd>
        <strong>Address: </strong>
        Contact for Information
      </dd>
    );
  }

  return (
    <dd>{[].concat(...addressArray.map(e => [<br key={e} />, e])).slice(1)}</dd>
  );
};

LocationAddress.propTypes = {
  location: PropTypes.object,
};

export default LocationAddress;
