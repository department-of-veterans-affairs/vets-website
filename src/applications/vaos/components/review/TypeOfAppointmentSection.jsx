import React from 'react';
import { FACILITY_TYPES } from '../../utils/constants';

export default function TypeOfAppointmentSection(props) {
  if (props.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE) {
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        Community care appointment
      </h2>
    );
  } else if (props.data.facilityType !== FACILITY_TYPES.COMMUNITY_CARE) {
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        VA appointment
      </h2>
    );
  }
  // TODO: Add direct schedule???
  return null;
}
