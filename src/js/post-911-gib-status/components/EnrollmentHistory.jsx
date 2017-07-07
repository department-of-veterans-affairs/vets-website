import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentPeriod from './EnrollmentPeriod';

class EnrollmentHistory extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};
    const enrollments = enrollmentData.enrollments || [];
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
                           (<h4>You don't have any enrollment history</h4>) :
                           (<h4>Does something look wrong in your enrollment history?</h4>);
    const historyExplanation = noEnrollmentHistory ?
                               (<span>Your enrollment history may not be available if:</span>) :
                               (<span>Certain enrollments may not be displayed in this history if:</span>);
    const historyExplanationBox = (historyMayLookIncorrect || noEnrollmentHistory) && (
      <div className="feature">
        {historyHeading}
        {historyExplanation}
        <ul>
          <li>Your school made a request to us that's still in process, or</li>
          <li>You made a request to us that's still in process, or</li>
          <li>You used or are using your benefit for flight, on-the-job, apprenticeship, or correspondence training</li>
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
