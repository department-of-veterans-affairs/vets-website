import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from 'platform/utilities/date';

export const Denied = ({ referenceNumber, requestDate }) => (
  <va-alert status="info" class="vads-u-margin-bottom--4">
    <h2 slot="headline">We denied your request for a COE</h2>
    <p className="vads-u-margin-bottom--0">
      You requested a COE on {requestDate && formatDateLong(requestDate)}.
    </p>
    <p className="vads-u-margin-top--0">Reference Number: {referenceNumber}</p>
    <p>
      We determined you don’t qualify for a COE. You can appeal our decision if
      you disagree. To learn how to appeal or to check the status of an appeal
      you already submitted, you can review the details of your COE request.
    </p>
    <va-link-action
      href="/housing-assistance/home-loans/check-coe-status/"
      text="Review your COE request details"
      type="secondary"
    />
    <p className="vads-u-margin-bottom--0">
      <span className="vads-u-font-weight--bold">Note:</span> Review your
      eligibility before submitting another request
    </p>
  </va-alert>
);

Denied.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.string.isRequired,
};
