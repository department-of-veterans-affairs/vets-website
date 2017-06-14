import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';

import { formatDateShort, formatPercent } from '../utils/helpers';

class UserInfoSection extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    // Get today's date to show information current as of
    const todayFormatted = formatDateShort(new Date());
    const percentageBenefit = formatPercent(enrollmentData.percentageBenefit) || 'unavailable';
    const fullName = `${enrollmentData.firstName} ${enrollmentData.lastName}`;

    // TODO: Figure out what will be sent to us if the user is ineligible so we can
    // conditionally show "Currently Disallowed" message

    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">This information is current as of {todayFormatted}</h4>
          </div>
        </div>
        <InfoPair label="Name" value={fullName}/>
        <InfoPair label="Date of Birth" value={formatDateShort(enrollmentData.dateOfBirth)}/>
        {/* TODO: find out whether this should be only partially displayed  xxxx1234 */}
        <InfoPair label="VA File Number" value={enrollmentData.vaFileNumber}/>
        <InfoPair label="Regional Processing Office" value={enrollmentData.regionalProcessingOffice}/>
        <div>
          <h4>When You Can Receive Benefits</h4>
          <div className="section-line">
            You are eligible to receive benefits between <strong>{formatDateShort(enrollmentData.eligibilityDate)}</strong> and <strong>{formatDateShort(enrollmentData.delimitingDate)}</strong>
          </div>
        </div>
        <div>
          <h4>Your Benefit Level</h4>
          <div className="section-line">
            You are eligible to receive benefits at a rate of <strong>{percentageBenefit}</strong>
          </div>
        </div>
      </div>
    );
  }
}

UserInfoSection.propTypes = {
  enrollmentData: PropTypes.object
};

export default UserInfoSection;
