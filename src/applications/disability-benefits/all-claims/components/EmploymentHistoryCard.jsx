import PropTypes from 'prop-types';
import React from 'react';

import { formatDateRange } from '../utils';

export default function EmploymentHistoryCard({ formData }) {
  const { name, dates } = formData;

  return (
    <p>
      <strong>{name}</strong>
      <br />
      {formatDateRange(dates)}
    </p>
  );
}

EmploymentHistoryCard.propTypes = {
  formData: PropTypes.shape({
    dates: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    name: PropTypes.string,
  }),
};
