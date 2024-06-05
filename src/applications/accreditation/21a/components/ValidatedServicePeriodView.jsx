import React from 'react';
import PropTypes from 'prop-types';

import { formatDateRange } from '../utils';

const ValidatedServicePeriodView = ({ formData }) => {
  return (
    <div className="vads-u-flex--fill">
      <strong>{formData?.serviceBranch}</strong>
      <p>{formatDateRange(formData?.dateRange)}</p>
    </div>
  );
};

ValidatedServicePeriodView.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default ValidatedServicePeriodView;
