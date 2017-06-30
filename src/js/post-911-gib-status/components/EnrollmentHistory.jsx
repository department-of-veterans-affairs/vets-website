import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentPeriod from './EnrollmentPeriod';

import { formatDateShort } from '../../common/utils/helpers';

class EnrollmentHistory extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};
    const enrollments = enrollmentData.enrollments || [];
    const todayFormatted = formatDateShort(new Date());
    const currentlyAllowed = enrollmentData.percentageBenefit !== 0 || enrollmentData.originalEntitlement !== 0;

    // TODO: find out when this warning should be shown.
    /*
    const expirationWarning = (
      <div className="usa-alert usa-alert-warning usa-content">
        <div className="usa-alert-body">
          <h2>Your benefit expires on {formatDateLong(enrollmentData.delimitingDate)}</h2>
          You have {enrollmentData.remainingEntitlement} months left on your Chapter 33 Post-9/11 GI Bill benefit before it expires on {formatDateShort(enrollmentData.delimitingDate)}.
        </div>
      </div>
    );
    */

    // History explanation box
    const benefitMaybePending =
      (enrollmentData.percentageBenefit > 0 || enrollmentData.originalEntitlement > 0) &&
      enrollmentData.usedEntitlement === 0;
    const historyMayLookIncorrect = enrollments.length > 0 || benefitMaybePending;
    const noEnrollmentHistory = enrollments.length === 0 && enrollmentData.usedEntitlement > 0;
    const historyHeading = noEnrollmentHistory ?
                           (<h4>You have no enrollment history.</h4>) :
                           (<h4>Does your history look incorrect?</h4>);
    const historyExplanation = noEnrollmentHistory ?
      (<span>There are various reasons why your enrollment history here is empty, or does not match your other records.</span>) :
      (<span>There are various reasons why your enrollment history here may not match your other records.</span>);
    const historyExplanationBox = (historyMayLookIncorrect || noEnrollmentHistory) && (
      <div className="feature">
        {historyHeading}
        {historyExplanation}
        <ul>
          <li>Your school may have made a request to VA which is pending.</li>
          <li>You may have made a request to VA which is pending.</li>
          <li>You may have used or are currently using your benefit for a non-tracked training type, including flight training, on-the-job-training, apprenticeship training, or correspondence training.</li>
        </ul>
      </div>
    );

    // Render enrollment periods
    const enrollmentHistory = enrollments.map((enrollment, index) => {
      const indexKey = `enrollment-${index}`;
      return (
        <EnrollmentPeriod
            key={indexKey}
            id={indexKey}
            enrollment={enrollment}/>
      );
    });

    let sectionContent;
    if (currentlyAllowed) {
      sectionContent = (
        <div>
          <h3 className="section-header">Enrollment History</h3>
          This information is current as of {todayFormatted}
          {historyExplanationBox}
          {enrollmentHistory}
        </div>
      );
    }

    return (
      <div>
        {sectionContent}
      </div>
    );
  }
}

EnrollmentHistory.propTypes = {
  enrollmentData: PropTypes.object
};

export default EnrollmentHistory;
