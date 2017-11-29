import { buildAddressArray } from '../../utils/facilityAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FacilityDirectionsLink extends Component {
  render() {
    const { facility } = this.props;
    const addressArray = buildAddressArray(facility);

    return (
      <span>
        <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressArray.join(', ')}`} target="_blank">
          <span className="usa-sr-only">External link</span>
          <i className="fa fa-road"/>Directions
        </a>
      </span>
    );
  }
}

FacilityDirectionsLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityDirectionsLink;
