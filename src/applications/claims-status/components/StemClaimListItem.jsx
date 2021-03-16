import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

export default function StemClaimListItem({ claim }) {
  if (!claim.attributes.automatedDenial) {
    return null;
  }
  const formattedReceiptDate = moment(claim.attributes.submittedAt).format(
    'MMMM D, YYYY',
  );
  return (
    <div className="claim-list-item-container">
      <h2 className="claim-list-item-header-v2 vads-u-font-size--h3">
        Edith Nourse Rogers STEM Scholarship application
        <br />
        updated on {moment(claim.attributes.deniedAt).format('MMMM D, YYYY')}
      </h2>
      <div className="card-status">
        <div className={`status-circle closed`} />
        <p>
          <strong>Status:</strong> Denied
        </p>
      </div>
      <div className="card-status">
        <p>
          <strong>Submitted on:</strong> {formattedReceiptDate}
        </p>
      </div>
      <Link
        aria-label={`View details of claim received ${formattedReceiptDate}`}
        className="usa-button usa-button-primary"
        to={`your-stem-claims/${claim.id}/status`}
      >
        View details
        <i className="fa fa-chevron-right" aria-hidden="true" />
      </Link>
    </div>
  );
}

StemClaimListItem.propTypes = {
  claim: PropTypes.object,
};
