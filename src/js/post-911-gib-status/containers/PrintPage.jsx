import React from 'react';
import { connect } from 'react-redux';

import InfoPair from '../components/InfoPair';

import { formatDateShort, formatPercent } from '../utils/helpers';

class PrintPage extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    // Get today's date to show information current as of
    const todayFormatted = formatDateShort(new Date());
    const percentageBenefit = formatPercent(enrollmentData.percentageBenefit) || 'unavailable';
    const fullName = `${enrollmentData.firstName} ${enrollmentData.lastName}`;

    return (
      <div className="print-status">
        <div className="print-screen">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300"/>
          <h1 className="section-header">Post-9/11 GI Bill Certificate of Eligibility</h1>
          <p>Dear {fullName},</p>
          <p>
            This certifies that you are entitled to benefits for an approved program of education
            or training under the Post-9/11 GI Bill.
          </p>
          <div>
            <InfoPair label="Date of Birth" value={formatDateShort(enrollmentData.dateOfBirth)}/>
            {/* TODO: find out whether this should be only partially displayed  xxxx1234 */}
            <InfoPair label="VA File Number" value={enrollmentData.vaFileNumber}/>
            <InfoPair label="Regional Processing Office" value={enrollmentData.regionalProcessingOffice}/>
          </div>
          <p>
            You are eligible to receive benefits between
            <strong> {formatDateShort(enrollmentData.eligibilityDate)}</strong> and
            <strong> {formatDateShort(enrollmentData.delimitingDate)}</strong> at a rate of
            <strong> {percentageBenefit}</strong>. Your enrollment history shows that you've received a total of
            <strong> {enrollmentData.originalEntitlement}</strong> of full-time benefits. You have used
            <strong> {enrollmentData.usedEntitlement}</strong> of those benefits, and have
            <strong> {enrollmentData.remainingEntitlement}</strong> remaining.
          </p>
          <p>
            Print this page for benefit and eligibility verification. This information is current as of {todayFormatted}.
          </p>

          <br/>
          <br/>
          <br/>

          <div className="help-desk">
            <h2>Need help?</h2>
            <div>Call the Vets.gov Help Desk</div>
            <div>1-855-574-7286</div>
            <div>Monday - Friday, 8:00am - 8:00pm (ET)</div>
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData
  };
}

export default connect(mapStateToProps)(PrintPage);
