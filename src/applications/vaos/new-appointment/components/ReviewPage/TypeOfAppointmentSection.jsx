import React from 'react';
import { FACILITY_TYPES } from '../../../utils/constants';
import { getTypeOfCare } from '../../redux/selectors';

export default function TypeOfAppointmentSection({ data }) {
  const typeOfCare = getTypeOfCare(data)?.name;
  const typeOfAppt =
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE
      ? 'Community Care'
      : 'VA Appointment';

  return (
    <>
      <span className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
        {typeOfAppt}
      </span>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        {typeOfCare}
      </h2>
    </>
  );
}
