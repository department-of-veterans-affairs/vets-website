import PropTypes from 'prop-types';
import React from 'react';

import { formatDateRange } from '../utils';

export default function EducationTrainingField({ formData }) {
  const { name, dates } = formData;

  return (
    <div>
      <strong>{name || ''}</strong>
      <p>{formatDateRange(dates)}</p>
    </div>
  );
}

EducationTrainingField.propTypes = {
  formData: PropTypes.shape({
    dates: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    name: PropTypes.string,
  }),
};
