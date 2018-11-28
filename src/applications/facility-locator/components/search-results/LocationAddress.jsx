import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/facilityAddress';

const LocationAddress = ({ location }) => {
  const addressArray = buildAddressArray(location);

  return (
    <span>
      {[].concat(...addressArray.map(e => [<br key={e} />, e])).slice(1)}
    </span>
  );
};

LocationAddress.propTypes = {
  location: PropTypes.object,
};

export default LocationAddress;
