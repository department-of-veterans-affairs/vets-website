import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTime } from '../util/dates';

export default function ClaimDetailsContent(props) {
  const {
    createdOn,
    claimStatus,
    claimNumber,
    appointmentDateTime,
    facilityName,
    modifiedOn,
  } = props;

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
    true,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  return (
    <>
      <h1>Your travel reimbursement claim for {appointmentDate}</h1>
      <span
        className="vads-u-font-size--h2 vads-u-font-weight--bold"
        data-testid="claim-details-claim-number"
      >
        Claim number: {claimNumber}
      </span>
      <h2 className="vads-u-font-size--h3">Where</h2>
      <p className="vads-u-margin-bottom--0">
        {appointmentDate} at {appointmentTime} appointment
      </p>
      <p className="vads-u-margin-y--0">{facilityName}</p>
      <h2 className="vads-u-font-size--h3">Claim status: {claimStatus}</h2>
      <p className="vads-u-margin-bottom--0">
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
};
