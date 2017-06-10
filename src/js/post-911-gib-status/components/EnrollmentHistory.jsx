import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentPeriod from '../components/EnrollmentPeriod';

import { formatDateShort, formatDateLong } from '../utils/helpers';

class EnrollmentHistory extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData;
    const today = formatDateShort(new Date());

    // TODO: find out when this warning should be shown.
    let expirationWarning;
    if (true) { // eslint-disable-line no-constant-condition
      expirationWarning = (
        <div className="usa-alert usa-alert-warning usa-content">
          <div className="usa-alert-body">
            <h2>Your benefit expires on {formatDateLong(enrollmentData.delimitingDate)}</h2>
            You have {enrollmentData.remainingEntitlement} months left on your Chapter 33 Post-9/11 GI Bill benefit before it expires on {formatDateShort(enrollmentData.delimitingDate)}.
          </div>
        </div>
      );
    }

    // TODO: find out when this warning should be shown.
    let trainingWarning;
    if (true) { // eslint-disable-line no-constant-condition
      trainingWarning = (
        <div className="feature">
          Enrollment history does not include flight training, on-the-job-training, apprenticeship training, or correspondence training.
        </div>
      );
    }

    // Render enrollment periods
    const enrollmentHistory = enrollmentData && enrollmentData.enrollmentList && enrollmentData.enrollmentList.length > 0 ? (
      enrollmentData.enrollmentList.map((enrollment, index) => {
        const indexKey = `enrollment-${index}`;

        return (
          <EnrollmentPeriod
              key={indexKey}
              enrollment={enrollment}/>
        );
      })
    ) : null;

    return (
      <div>
        <h3 className="section-header">Enrollment History</h3>
        <div className="section-line">This information is current as of {today}</div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>Total months received: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {enrollmentData.originalEntitlement}
          </div>
        </div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>Used: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {enrollmentData.usedEntitlement}
          </div>
        </div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>Remaining: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {enrollmentData.remainingEntitlement}
          </div>
        </div>
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
