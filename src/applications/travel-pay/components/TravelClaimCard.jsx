import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDateTime } from '../util/dates';

export default function TravelClaimCard(props) {
  const {
    canViewClaimDetails,
    id,
    createdOn,
    claimStatus,
    claimNumber,
    appointmentDateTime,
    facilityName,
    modifiedOn,
  } = props;

  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  let appointmentDateTitle;
  if (appointmentDateTime == null) {
    appointmentDateTitle = 'Appointment information not available';
  } else {
    const [appointmentDate, appointmentTime] = formatDateTime(
      appointmentDateTime,
      true,
    );
    appointmentDateTitle = `${appointmentDate} at ${appointmentTime} appointment`;
  }

  const ariaLinkLabel = `Travel reimbursement claim details for ${appointmentDateTitle}`;

  return (
    <va-card key={id} class="travel-claim-card vads-u-margin-bottom--2">
      <h3
        className="vads-u-margin-top--2 vads-u-margin-bottom--0"
        data-testid="travel-claim-details"
      >
        {appointmentDateTitle}
      </h3>
      <h4 className="vads-u-margin-bottom--1">Where</h4>
      <p className="vads-u-margin-top--0">{facilityName}</p>
      <h4 className="vads-u-margin-bottom--1">Claim Details</h4>
      <ul className="vads-u-margin-top--0">
        <li>
          <strong>Claim status: {claimStatus}</strong>
        </li>
        <li>Claim number: {claimNumber}</li>
        <li>
          Submitted on {createDate} at {createTime}
        </li>
        <li>
          Updated on {updateDate} at {updateTime}
        </li>
      </ul>
      {canViewClaimDetails && (
        <Link
          to={{
            pathname: `/claims/${id}`,
          }}
          className="vads-u-display--flex vads-u-align-items--center"
          aria-label={ariaLinkLabel}
        >
          Travel reimbursement claim details <va-icon icon="chevron_right" />
        </Link>
      )}
    </va-card>
  );
}

TravelClaimCard.propTypes = {
  appointmentDateTime: PropTypes.string,
  canViewClaimDetails: PropTypes.bool,
  claimNumber: PropTypes.string,
  claimStatus: PropTypes.string,
  createdOn: PropTypes.string,
  facilityName: PropTypes.string,
  id: PropTypes.string,
  modifiedOn: PropTypes.string,
};
