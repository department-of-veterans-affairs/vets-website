import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';

import { formatDateShort } from '../../common/utils/helpers';
import { formatPercent, formatVAFileNumber } from '../utils/helpers';

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
          <div className="section">
            <h4>Your Benefits</h4>
            <InfoPair label="Total months received" value={enrollmentData.originalEntitlement}/>
            <InfoPair label="Months you've used" value={enrollmentData.usedEntitlement}/>
            <InfoPair label="Months you have left to use" value={enrollmentData.remainingEntitlement} displayIfZero/>
            <p id="benefit-level">
              Your eligibility rate for payments and maximum amounts is <strong>{percentageBenefit}</strong>.
            </p>
          </div>
          <div className="section">
            <h4>Benefit End Date</h4>
            <p>
              You can use these benefits until <strong>{formatDateShort(enrollmentData.delimitingDate)}</strong>.
            </p>
          </div>
        </div>
      );
    } else {
      entitlementInfo = (
        <div>
          <h4>Your Benefits</h4>
          <div className="usa-alert usa-alert-warning usa-content">
            <div className="usa-alert-body">
              <h2>Currently Not Qualified</h2>
              You can't get Post-9/11 GI Bill benefits right now. If you continue to
              serve, you may qualify in the future.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {currentAsOfAlert}
        <div className="section">
          <InfoPair
              label="Name"
              value={fullName}
              spacingClass="section-line"/>
          <InfoPair
              label="Date of birth"
              value={formatDateShort(enrollmentData.dateOfBirth)}
              spacingClass="section-line"/>
          {/* TODO: find out whether this should be only partially displayed  xxxx1234 */}
          <InfoPair
              label="VA file number"
              value={formatVAFileNumber(enrollmentData.vaFileNumber)}
              spacingClass="section-line"/>
          <InfoPair
              label="Regional processing office"
              value={enrollmentData.regionalProcessingOffice}
              spacingClass="section-line"/>
        </div>
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
