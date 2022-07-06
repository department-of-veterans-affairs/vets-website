import React from 'react';
import { cleanPhoneNumber } from './facilityUtilities';

export default function FacilityPhone({ facility }) {
  const { phone } = facility.attributes;
  const mainPhone = cleanPhoneNumber(phone.main);
  const mentalHealthCarePhone = cleanPhoneNumber(phone.mentalHealthClinic);

  return (
    <div className="vads-u-margin-bottom--0">
      {facility.attributes.phone.main && (
        <div className="main-phone vads-u-margin-bottom--1">
          <strong>Main phone: </strong>
          <a href={`tel:${mainPhone}`}>{mainPhone}</a>
        </div>
      )}
      {facility.attributes.phone.mentalHealthClinic && (
        <div className="mental-health-care-phone">
          <strong>Mental health care: </strong>
          <a href={`tel:${mentalHealthCarePhone}`}>{mentalHealthCarePhone}</a>
        </div>
      )}
    </div>
  );
}
