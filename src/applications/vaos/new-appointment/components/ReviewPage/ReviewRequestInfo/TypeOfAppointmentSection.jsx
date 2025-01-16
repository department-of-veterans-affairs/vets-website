import React from 'react';
import PropTypes from 'prop-types';
import { sentenceCase } from '../../../../utils/formatters';
import { getTypeOfCare } from '../../../redux/selectors';

export default function TypeOfAppointmentSection({ data }) {
  const typeOfCare = sentenceCase(getTypeOfCare(data)?.name);

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Type of care
      </h2>
      <span>{typeOfCare}</span>
    </>
  );
}

TypeOfAppointmentSection.propTypes = {
  data: PropTypes.object.isRequired,
  flowType: PropTypes.string,
};
