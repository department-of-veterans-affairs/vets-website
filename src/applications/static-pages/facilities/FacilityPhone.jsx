import React from 'react';
import { cleanPhoneNumber } from './facilityUtilities';

export default class FacilityPhone extends React.Component {
  render() {
    const { phone } = this.props.facility.attributes;
    const mainPhone = cleanPhoneNumber(phone.main);
    const mentalHealthClinicPhone = cleanPhoneNumber(phone.mentalHealthClinic);

    return (
      <div className="vads-u-margin-bottom--0">
        {this.props.facility.attributes.phone.main && (
          <div className="main-phone vads-u-margin-bottom--1">
            <strong>Main phone: </strong>
            <a href={`tel:${mainPhone}`}>{mainPhone}</a>
          </div>
        )}
        {this.props.facility.attributes.phone.mentalHealthClinic && (
          <div className="mental-health-clinic-phone">
            <strong>Mental health clinic: </strong>
            <a href={`tel:${mentalHealthClinicPhone}`}>
              {mentalHealthClinicPhone}
            </a>
          </div>
        )}
      </div>
    );
  }
}
