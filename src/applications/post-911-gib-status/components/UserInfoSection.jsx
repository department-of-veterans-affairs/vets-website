import React from 'react';
import PropTypes from 'prop-types';

import {
  formatDateShort,
  formatDateParsedZoneLong,
} from 'platform/utilities/date';
import InfoPair from './InfoPair';

import {
  formatPercent,
  formatVAFileNumber,
  formatMonthDayFields,
  benefitEndDateExplanation,
  notQualifiedWarning,
} from '../utils/helpers.jsx';

function UserInfoSection({ enrollmentData = {}, showCurrentAsOfAlert }) {
  // Get today’s date to show information current as of
  const todayFormatted = formatDateShort(new Date());
  const percentageBenefit =
    formatPercent(enrollmentData.percentageBenefit) || 'unavailable';
  const fullName = `${enrollmentData.firstName} ${enrollmentData.lastName}`;

  let currentAsOfAlert;
  if (showCurrentAsOfAlert) {
    currentAsOfAlert = (
      <div className="usa-alert usa-alert-info">
        <div className="usa-alert-body">
          <h4 id="current-as-of" className="usa-alert-heading">
            This information is current as of {todayFormatted}
          </h4>
        </div>
      </div>
    );
  }

  let benefitEndDate;
  if (enrollmentData.activeDuty) {
    benefitEndDate = benefitEndDateExplanation(
      'activeDuty',
      enrollmentData.delimitingDate,
    );
  } else if (
    enrollmentData.remainingEntitlement.months > 0 ||
    enrollmentData.remainingEntitlement.days > 0
  ) {
    benefitEndDate = benefitEndDateExplanation(
      'remainingEntitlement',
      enrollmentData.delimitingDate,
    );
  }

  let entitlementInfo;
  const { originalEntitlement } = enrollmentData;
  const { usedEntitlement } = enrollmentData;
  const { remainingEntitlement } = enrollmentData;

  if (enrollmentData.veteranIsEligible) {
    entitlementInfo = (
      <div>
        <div className="section">
          <h2>Your Benefits</h2>
          <InfoPair
            label="Total months received"
            value={formatMonthDayFields(originalEntitlement)}
          />
          <InfoPair
            label="Months you’ve used"
            value={formatMonthDayFields(usedEntitlement)}
          />
          <InfoPair
            label="Months you have left to use"
            value={formatMonthDayFields(remainingEntitlement)}
            displayIfZero
          />
          <p id="benefit-level">
            Your eligibility percentage is <strong>{percentageBenefit}</strong>.
            <br />
            <a href="/education/gi-bill-comparison-tool/" target="_blank">
              Find out how much money you can expect to get based on your
              eligibility percentage
            </a>
          </p>
        </div>
        {benefitEndDate}
      </div>
    );
  } else {
    entitlementInfo = notQualifiedWarning();
  }

  return (
    <div>
      {currentAsOfAlert}
      <div className="section">
        <InfoPair
          label="Name"
          value={fullName}
          id="gibs-full-name"
          additionalClass="section-line"
        />
        <InfoPair
          label="Date of birth"
          name="dateOfBirth"
          value={formatDateParsedZoneLong(enrollmentData.dateOfBirth)}
          additionalClass="section-line"
        />
        <InfoPair
          label="VA file number"
          value={formatVAFileNumber(enrollmentData.vaFileNumber)}
          additionalClass="section-line"
        />
        <InfoPair
          label="Regional Processing Office"
          value={enrollmentData.regionalProcessingOffice}
          additionalClass="section-line"
        />
      </div>
      {entitlementInfo}
    </div>
  );
}

UserInfoSection.propTypes = {
  enrollmentData: PropTypes.object,
  showCurrentAsOfAlert: PropTypes.bool,
};

export default UserInfoSection;
