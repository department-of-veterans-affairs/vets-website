import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from 'platform/utilities/date';

export const Pending = ({ referenceNumber, requestDate }) => (
  <va-alert status="info" class="vads-u-margin-bottom--4">
    <h2 slot="headline">We’re reviewing your request</h2>
    <p className="vads-u-margin-bottom--0">
      You requested a COE on {requestDate && formatDateLong(requestDate)}.
    </p>
    <p className="vads-u-margin-top--0">Reference Number: {referenceNumber}</p>
    <p>
      You’ll receive an email about your eligibility and how to get your COE if
      you qualify. We’ll provide additional updates on the VA home loan COE
      status page.
    </p>
    <va-link-action
      href="/housing-assistance/home-loans/check-coe-status/"
      text="Check the status of your COE request"
      type="secondary"
    />
    <p className="vads-u-margin-bottom--0">
      If it’s been more than 5 days since you submitted your request and haven’t
      received a response, you can call us at{' '}
      <va-telephone contact="8778273702" /> (TTY:711).
    </p>
  </va-alert>
);

Pending.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.string.isRequired,
};
