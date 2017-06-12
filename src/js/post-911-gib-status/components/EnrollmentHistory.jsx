import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';
import EnrollmentPeriod from './EnrollmentPeriod';

import { formatDateShort, formatDateLong } from '../utils/helpers';

class EnrollmentHistory extends React.Component {
  render() {
    const { enrollmentData } = this.props || {};
    const today = formatDateShort(new Date());

    // TODO: find out when this warning should be shown.
    const expirationWarning = (
      <div className="usa-alert usa-alert-warning usa-content">
        <div className="usa-alert-body">
          <h2>Your benefit expires on {formatDateLong(enrollmentData.delimitingDate)}</h2>
          You have {enrollmentData.remainingEntitlement} months left on your Chapter 33 Post-9/11 GI Bill benefit before it expires on {formatDateShort(enrollmentData.delimitingDate)}.
        </div>
      </div>
    );

    // TODO: find out when this warning should be shown.
    const trainingWarning = (
      <div className="feature">
        Enrollment history does not include flight training, on-the-job-training, apprenticeship training, or correspondence training.
      </div>
    );

    // Render enrollment periods
    const enrollmentHistory = (enrollmentData.enrollments || []).map((enrollment, index) => {
      const indexKey = `enrollment-${index}`;
      return (
        <EnrollmentPeriod
            key={indexKey}
            enrollment={enrollment}/>
      );
    });

    return (
      <div>
        <h3 className="section-header">Enrollment History</h3>
        {/* Find out if this line should be present if the blue box with same info is rendered */}
        <div className="section-line">This information is current as of {today}</div>
        <InfoPair label="Total months received" value={enrollmentData.originalEntitlement}/>
        <InfoPair label="Used" value={enrollmentData.usedEntitlement}/>
        <InfoPair label="Remaining" value={enrollmentData.remainingEntitlement}/>
        {expirationWarning}
        {trainingWarning}
        {enrollmentHistory}
      </div>
    );
  }
}

EnrollmentHistory.propTypes = {
  enrollmentData: PropTypes.object
};

export default EnrollmentHistory;
