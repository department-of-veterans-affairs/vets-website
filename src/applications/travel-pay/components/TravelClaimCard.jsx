import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTime } from '../util/dates';
import { CLAIMS_STATUSES } from '../util/constants';

export default function TravelClaimCard(props) {
  const {
    id,
    createdOn,
    claimStatus,
    claimNumber,
    appointmentDateTime,
    facilityName,
    modifiedOn,
  } = props;

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  return (
    <va-card tabIndex={0} key={id} class="vads-u-margin-bottom--2">
      <h3
        className="vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-size--h3"
        data-testid="travel-claim-details"
      >
        {appointmentDate} at {appointmentTime} appointment
      </h3>
      <h4 className="vads-u-margin-bottom--1">Where</h4>
      <p className="vads-u-margin-top--0">{facilityName}</p>

      <h4 className="vads-u-margin-bottom--1">Claim Details</h4>
      <p className="vads-u-margin-top--0">
        <strong>
          Claim status: {CLAIMS_STATUSES[claimStatus] || claimStatus}
        </strong>{' '}
        <br />
        Claim number: {claimNumber} <br />
        Submitted on {createDate} at {createTime} <br />
        Updated on {updateDate} at {updateTime}
      </p>
    </va-card>
  );
}

TravelClaimCard.propTypes = {
  appointmentDateTime: PropTypes.string,
  claimNumber: PropTypes.string,
  claimStatus: PropTypes.string,
  createdOn: PropTypes.string,
  facilityName: PropTypes.string,
  id: PropTypes.string,
  modifiedOn: PropTypes.string,
};
