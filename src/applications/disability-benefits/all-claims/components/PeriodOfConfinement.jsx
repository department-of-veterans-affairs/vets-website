import PropTypes from 'prop-types';
import React from 'react';
import { formatDateRange } from '../utils';

export default function PeriodOfConfinement({ formData = {} }) {
  return <div>{formatDateRange(formData)}</div>;
}

PeriodOfConfinement.propTypes = {
  formData: PropTypes.object,
};
