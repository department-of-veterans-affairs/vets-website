import React from 'react';
import PropTypes from 'prop-types';
import { FLOW_TYPES } from '../../../../utils/constants';
import { getTypeOfCare } from '../../../redux/selectors';

export default function TypeOfAppointmentSection({ data, flowType }) {
  const typeOfCare = getTypeOfCare(data)?.name;

  let typeOfAppt = 'VA Appointment';

  if (FLOW_TYPES.REQUEST === flowType) {
    typeOfAppt = 'Type of care';

    return (
      <>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          {typeOfAppt}
        </h2>
        <span className="vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {typeOfCare}
        </span>
      </>
    );
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
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
