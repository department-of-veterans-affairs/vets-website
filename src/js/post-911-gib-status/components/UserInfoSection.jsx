import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';

import { formatDateShort } from '../../common/utils/helpers';
import { formatPercent } from '../utils/helpers';

class UserInfoSection extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    // Get today's date to show information current as of
    const todayFormatted = formatDateShort(new Date());
    const percentageBenefit = formatPercent(enrollmentData.percentageBenefit) || 'unavailable';
    const fullName = `${enrollmentData.firstName} ${enrollmentData.lastName}`;
    const currentlyAllowed = enrollmentData.percentageBenefit !== 0 || enrollmentData.originalEntitlement !== 0;

    let currentAsOfAlert;
    if (this.props.showCurrentAsOfAlert) {
      currentAsOfAlert = (
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <h4 id="current-as-of" className="usa-alert-heading">This information is current as of {todayFormatted}</h4>
          </div>
        </div>
      );
    }

    let entitlementInfo;
    if (currentlyAllowed) {
      entitlementInfo = (
        <div>
          <div>
            <h4>When You Can Receive Benefits</h4>
            <div className="section-line">
              You are eligible to receive benefits between <strong>{formatDateShort(enrollmentData.eligibilityDate)}</strong> and <strong>{formatDateShort(enrollmentData.delimitingDate)}</strong>.
            </div>
          </div>
          <div>
            <h4>Your Benefit Level</h4>
            <div className="section-line" id="benefit-level">
              You are eligible to receive benefits at a rate of <strong>{percentageBenefit}</strong>.
            </div>
          </div>
          <InfoPair label="Total months received" value={enrollmentData.originalEntitlement}/>
          <InfoPair label="Used" value={enrollmentData.usedEntitlement}/>
          <InfoPair label="Remaining" value={enrollmentData.remainingEntitlement}/>
        </div>
      );
    } else {
      entitlementInfo = (
        <div>
          <h4>When You Can Receive Benefits</h4>
          <div className="usa-alert usa-alert-warning usa-content">
            <div className="usa-alert-body">
              <h2>Currently Not Qualified</h2>
              We have received your application and have determined that you are not currently eligible
              for Post-9/11 GI Bill benefits. Additional service time could change this determination.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {currentAsOfAlert}
        <InfoPair
            label="Name"
            value={fullName}
            spacingClass="section-line"/>
        <InfoPair
            label="Date of Birth"
            value={formatDateShort(enrollmentData.dateOfBirth)}
            spacingClass="section-line"/>
        {/* TODO: find out whether this should be only partially displayed  xxxx1234 */}
        <InfoPair
            label="VA File Number"
            value={enrollmentData.vaFileNumber}
            spacingClass="section-line"/>
        <InfoPair
            label="Regional Processing Office"
            value={enrollmentData.regionalProcessingOffice}
            spacingClass="section-line"/>
        {entitlementInfo}
      </div>
    );
  }
}

UserInfoSection.propTypes = {
  enrollmentData: PropTypes.object,
  showCurrentAsOfAlert: PropTypes.bool
};

export default UserInfoSection;
