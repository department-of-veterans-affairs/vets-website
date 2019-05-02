import React from 'react';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';

export default class FacilityAddress extends React.Component {
  render() {
    let address = buildAddressArray(this.props.facility);

    if (address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      const { lat, long } = this.props.facility.attributes;
      address = `${lat},${long}`;
    }

    return (
      <div>
        <address>
          <div>{this.props.facility.attributes.address.physical.address1}</div>
          <div>
            {this.props.facility.attributes.address.physical.city}
            {', '}
            {this.props.facility.attributes.address.physical.state}{' '}
            {this.props.facility.attributes.address.physical.zip}
          </div>
        </address>
        <div>
          <a
            href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
        </div>
      </div>
    );
  }
}
