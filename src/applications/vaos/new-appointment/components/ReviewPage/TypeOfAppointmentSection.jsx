import React from 'react';
import PropTypes from 'prop-types';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../utils/constants';
import { getTypeOfCare } from '../../redux/selectors';

export default function TypeOfAppointmentSection({ data, flowType }) {
  const typeOfCare = getTypeOfCare(data)?.name;

  let typeOfAppt = 'VA Appointment';
  if (FLOW_TYPES.REQUEST === flowType) {
    if (data.facilityType === FACILITY_TYPES.COMMUNITY_CARE)
      typeOfAppt = 'Community Care';

    typeOfAppt = 'Type of care';
  }

  if (FACILITY_TYPES.COMMUNITY_CARE === data.facilityType)
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

  return (
    <>
      <h2 className="vads-u-font-size--base vads-u-margin-top--0">
        {typeOfAppt}
      </h2>
      <span className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
        {typeOfCare}
      </span>
    </>
  );
}

TypeOfAppointmentSection.propTypes = {
  data: PropTypes.object.isRequired,
  flowType: PropTypes.string,
};
