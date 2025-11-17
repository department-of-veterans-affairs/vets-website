import React from 'react';
import PropTypes from 'prop-types';

import { hasEmploymentInLast12Months } from '../utils/employment';

const EmploymentCheckReview = ({ data }) => {
  const employmentStatus = hasEmploymentInLast12Months(data);

  if (employmentStatus === undefined) {
    return null;
  }

  const message = employmentStatus
    ? 'You told us you worked during the past 12 months. The employers you added are listed below.'
    : "We skipped Section II because you told us you didn't work in the past 12 months.";

  return (
    <dl className="review">
      <div className="review-row">
        <dt>Employment in the past 12 months</dt>
        <dd>
          <p className="vads-u-margin--0">{message}</p>
        </dd>
      </div>
    </dl>
  );
};

EmploymentCheckReview.propTypes = {
  data: PropTypes.object,
};

export default EmploymentCheckReview;
