import { buildAddressArray } from '../../utils/facilityAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FacilityAddress extends Component {
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

FacilityAddress.propTypes = {
  location: PropTypes.object,
};

export default FacilityAddress;
