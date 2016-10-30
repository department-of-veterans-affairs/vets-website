import { buildAddressArray } from '../../utils/facilityAddress';
import React, { Component, PropTypes } from 'react';

class FacilityDirectionsLink extends Component {
  render() {
    const { facility } = this.props;
    const addressArray = buildAddressArray(facility);

    return (
      <span>
        <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressArray.join(', ')}`} target="_blank">
          <i className="fa fa-road" style={{ marginRight: '0.5rem' }}/> Directions
        </a>
      </span>
    );
  }
}

FacilityDirectionsLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityDirectionsLink;
