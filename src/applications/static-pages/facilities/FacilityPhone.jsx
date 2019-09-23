import React from 'react';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';

export default class FacilityPhone extends React.Component {
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
      <div className="vads-u-margin-bottom--0">
        <div className="main-phone vads-u-margin-bottom--1">
          <h3>Phone numbers</h3>
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
    );
  }
}
