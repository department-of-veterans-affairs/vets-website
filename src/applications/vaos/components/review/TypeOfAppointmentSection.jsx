import React from 'react';

export default function TypeOfAppointmentSection(props) {
  if (props.data.facilityType === 'communityCare') {
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        Community care appointment
      </h2>
    );
  } else if (props.data.facilityType !== 'communityCare') {
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        VA appointment
      </h2>
    );
  }
  // TODO: Add direct schedule???
  return null;
}
