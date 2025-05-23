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
            size="2"
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
              size="2"
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
        <h3 className="submission__card-name">
          {submission.url ? (
            <Link
              to={`/submissions/${submission.id}`}
              data-testid={`submission-card-${submission.id}-name`}
              className="submission__card-title vads-u-font-size--h4 vads-u-font-family--serif"
            >
              {`${submission.lastName}, ${submission.firstName}`}
            </Link>
          ) : (
            `${submission.lastName}, ${submission.firstName}`
          )}
        </h3>
        <p>
          <strong>
            {submission.formType}
            {submission.packet ? ' packet' : ''}
          </strong>
        </p>
        <p>
          {`Confirmation: ${submission.confirmationNumber}`}
          <br />
          {'VBMS efolder status: '}
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
