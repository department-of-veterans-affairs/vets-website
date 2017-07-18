import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';

import { formatDateShort, formatDateLong } from '../../common/utils/helpers';
import {
  formatPercent,
  formatVAFileNumber,
  formatMonthDayFields,
  benefitEndDateExplanation
} from '../utils/helpers';

class UserInfoSection extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    // Get today's date to show information current as of
    const todayFormatted = formatDateShort(new Date());
    const percentageBenefit = formatPercent(enrollmentData.percentageBenefit) || 'unavailable';
    const fullName = `${enrollmentData.firstName} ${enrollmentData.lastName}`;

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

    let benefitEndDate;
    if (enrollmentData.activeDuty) {
      benefitEndDate = benefitEndDateExplanation('activeDuty', enrollmentData.delimitingDate);
    } else if (enrollmentData.remainingEntitlement.months > 0 || enrollmentData.remainingEntitlement.days > 0) {
      benefitEndDate = benefitEndDateExplanation('remainingEntitlement', enrollmentData.delimitingDate);
    }

    let entitlementInfo;
    const originalEntitlement = enrollmentData.originalEntitlement;
    const usedEntitlement = enrollmentData.usedEntitlement;
    const remainingEntitlement = enrollmentData.remainingEntitlement;

    if (enrollmentData.veteranIsEligible) {
      entitlementInfo = (
        <div>
          <div className="section">
            <h4>Your Benefits</h4>
            <InfoPair label="Total months received" value={formatMonthDayFields(originalEntitlement)}/>
            <InfoPair label="Months you've used" value={formatMonthDayFields(usedEntitlement)}/>
            <InfoPair label="Months you have left to use" value={formatMonthDayFields(remainingEntitlement)} displayIfZero/>
            <p id="benefit-level">
              Your eligibility percentage is <strong>{percentageBenefit}</strong>.
              <br/>
              <a href="http://benefits.va.gov/GIBILL/resources/benefits_resources/rate_tables.asp" target="_blank">
                Find out how much money you can expect to get based on your eligibility percentage.
              </a>
            </p>
          </div>
          {benefitEndDate}
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
              value={formatDateLong(enrollmentData.dateOfBirth)}
              spacingClass="section-line"/>
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
