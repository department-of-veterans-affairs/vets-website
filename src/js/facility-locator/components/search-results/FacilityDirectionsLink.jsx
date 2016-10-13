import React, { Component, PropTypes } from 'react';
import { compact } from 'lodash';

class FacilityDirectionsLink extends Component {
  render() {
    const { attributes: { address } } = this.props.facility;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    return (
      <span>
        <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString.join(' ')}`} target="_blank">
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
