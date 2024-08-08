import React from 'react';
import PropTypes from 'prop-types';

import { enrollmentHistoryExplanation } from '../utils/helpers.jsx';

import EnrollmentPeriod from './EnrollmentPeriod';

function EnrollmentHistory({ enrollmentData = {} }) {
  const enrollments = enrollmentData.enrollments || [];

  // History explanation box
  let historyExplanationBox;
  const noEnrollmentHistory =
    enrollmentData.usedEntitlement.months === 0 &&
    enrollmentData.usedEntitlement.days === 0;

  if (noEnrollmentHistory) {
    historyExplanationBox = enrollmentHistoryExplanation.noEnrollmentHistory;
  } else {
    historyExplanationBox = enrollmentHistoryExplanation.standard;
  }

  // Render enrollment periods
  const enrollmentHistory = enrollments.map((enrollment, index) => {
    const indexKey = `enrollment-${index}`;
    return (
      <EnrollmentPeriod key={indexKey} id={indexKey} enrollment={enrollment} />
    );
  });

  let sectionContent;
  if (enrollmentData.veteranIsEligible) {
    sectionContent = (
      <div>
        <h2 className="section-header">Enrollment History</h2>
        {historyExplanationBox}
        {enrollmentHistory}
      </div>
    );
  }

  return <div>{sectionContent}</div>;
}

EnrollmentHistory.propTypes = {
  enrollmentData: PropTypes.object,
};

export default EnrollmentHistory;
