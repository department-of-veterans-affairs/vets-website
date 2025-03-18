import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime } from '../util/dates';
import { STATUSES } from '../constants';

const title = 'Your travel reimbursement claim';

export default function ClaimDetailsContent({
  createdOn,
  claimStatus,
  claimNumber,
  appointmentDateTime,
  facilityName,
  modifiedOn,
  reimbursementAmount,
}) {
  useSetPageTitle(title);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const claimsMgmtToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagement,
  );

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
    true,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  return (
    <>
      <h1>
        {title} for {appointmentDate}
      </h1>
      <span
        className="vads-u-font-size--h2 vads-u-font-weight--bold"
        data-testid="claim-details-claim-number"
      >
        Claim number: {claimNumber}
      </span>
      <h2 className="vads-u-font-size--h3">Claim status: {claimStatus}</h2>
      {claimsMgmtToggle &&
        claimStatus === STATUSES.Denied.name && <AppealContent />}
      <h2 className="vads-u-font-size--h3">Claim information</h2>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">Where</p>
      <p className="vads-u-margin-y--0">
        {appointmentDate} at {appointmentTime} appointment
      </p>
      <p className="vads-u-margin-top--0">{facilityName}</p>
      {claimsMgmtToggle &&
        reimbursementAmount > 0 && (
          <p className="vads-u-margin-bottom--0">
            Reimbursement amount of ${reimbursementAmount}
          </p>
        )}
      <p className="vads-u-margin-y--0">
        Submitted on {createDate} at {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on on {updateDate} at {updateTime}
      </p>
    </>
  );
}

ClaimDetailsContent.propTypes = {
  appointmentDateTime: PropTypes.string.isRequired,
  claimNumber: PropTypes.string.isRequired,
  claimStatus: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  facilityName: PropTypes.string.isRequired,
  modifiedOn: PropTypes.string.isRequired,
  reimbursementAmount: PropTypes.number,
};

function AppealContent() {
  return (
    <>
      <va-link text="Appeal the claim decision" href="/decision-reviews" />
      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="What to expect when you appeal"
      >
        When appealing this decision you can:
        <ul>
          <li>Submit an appeal via the Board of Appeals.</li>
          <li>
            Send a secure message to the Beneficiary Travel team of the VA
            facility that provided your care or of you home VA facility.
          </li>
          <li>
            Mail a printed version of Form 10-0998 with the appropriate
            documentation.
          </li>
        </ul>
      </va-additional-info>
    </>
  );
}
