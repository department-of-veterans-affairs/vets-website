import { buildAddressArray } from '../../utils/facilityAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class LocationAddress extends Component {
  render() {
    const { location } = this.props;
    const addressArray = buildAddressArray(location);

    return (
      <span>
        {[].concat(...addressArray.map(e => [<br key={e}/>, e])).slice(1)}
      </span>
    );
  }
}

LocationAddress.propTypes = {
  location: PropTypes.object,
};

export default LocationAddress;
