import React from 'react';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';

export default class FacilityAddressPhone extends React.Component {
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
      <div className={this.props.className}>
        <address className="vads-u-margin-bottom--1p5">
          <div>{this.props.facility.attributes.address.physical.address1}</div>
          <div>
            {this.props.facility.attributes.address.physical.city}
            {', '}
            {this.props.facility.attributes.address.physical.state}{' '}
            {this.props.facility.attributes.address.physical.zip}
          </div>
        </address>
        <div className="vads-u-margin-bottom--1p5">
          <a
            href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
        </div>
        <div className="vads-u-margin-bottom--1p5">
          <div className="main-phone">
            <strong>Main phone: </strong>
            <a
              href={`tel:${this.props.facility.attributes.phone.main.replace(
                /[ ]?x/,
                '',
              )}`}
            >
              {this.props.facility.attributes.phone.main.replace(/[ ]?x/, '')}
            </a>
          </div>
          <div className="mental-health-clinic-phone">
            <strong>Mental health clinic: </strong>
            <a
              href={`tel:${this.props.facility.attributes.phone.mentalHealthClinic.replace(
                /[ ]?x/,
                '',
              )}`}
            >
              {this.props.facility.attributes.phone.mentalHealthClinic.replace(
                /[ ]?x/,
                '',
              )}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
