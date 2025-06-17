import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';

const formatStatus = submission => {
  switch (submission.vbmsStatus) {
    case 'received':
      return (
        <span>
          <va-icon
            class="submissions__inline-status-icon submissions__card-check"
            icon="check_circle"
            size="3"
          />
          {` Received ${formatDateParsedZoneLong(submission.vbmsReceivedDate)}`}
        </span>
      );
    case 'processing_error':
      return (
        <>
          <span>
            <va-icon
              icon="warning"
              class="submissions__inline-status-icon submissions__card-error"
              size="3"
            />
            {' Processing error'}
          </span>
          <br />
          <span>Resubmit or contact 800-827-1000 for assistance</span>
        </>
      );
    case 'awaiting_receipt':
    default:
      return <span>Awaiting receipt</span>;
  }
};

const SubmissionCard = ({ submission }) => {
  return (
    <li>
      <va-card class="submission__card">
        <p>Submitted {formatDateParsedZoneLong(submission.submittedDate)}</p>
        <h1 className="submission__card-name vads-u-font-size--h3 vads-u-font-family--serif">
          {submission.url ? (
            <Link
              to={`/submissions/${submission.id}`}
              data-testid={`submission-card-${submission.id}-name`}
              className="submission__card-title"
            >
              {`${submission.lastName}, ${submission.firstName}`}
            </Link>
          ) : (
            `${submission.lastName}, ${submission.firstName}`
          )}
        </h1>
        <p>
          <strong>
            {submission.formType}
            {submission.packet ? ' packet' : ''}
          </strong>
        </p>
        <p>
          <span className="submission__card-attribute-text">
            {'Confirmation: '}
          </span>
          {submission.confirmationNumber}
          <br />
          <span className="submission__card-attribute-text">
            {'VBMS efolder status: '}
          </span>
          {formatStatus(submission)}
        </p>
      </va-card>
    </li>
  );
};

SubmissionCard.propTypes = {
  cssClass: PropTypes.string,
  id: PropTypes.string,
  submission: PropTypes.object,
};

export default SubmissionCard;
