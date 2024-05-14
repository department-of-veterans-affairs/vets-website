import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

function formatDateTime(datetimeString) {
  const dateTime = new Date(datetimeString);
  const formattedDate = format(dateTime, 'eeee, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return [formattedDate, formattedTime];
}

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
    <va-card key={id} class="travel-claim-card vads-u-margin-bottom--2">
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-size--h3 ">
        {/* TODO: validate if appending "appointment" is always correct */}
        {appointmentDate} at {appointmentTime} appointment
      </h2>
      <h3 className="vads-u-margin-bottom--1">Where</h3>
      <p className="vads-u-margin-top--0">{facilityName}</p>

      <h3 className="vads-u-margin-bottom--1">Claim Details</h3>
      <p className="vads-u-margin-top--0">
        <strong>Claim status: {claimStatus}</strong> <br />
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
