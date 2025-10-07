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
          {` Received ${submission.vbmsReceivedDate &&
            formatDateParsedZoneLong(submission.vbmsReceivedDate)}`}
        </span>
      );
    case 'awaiting_receipt_warning':
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
          <span>Contact 855-225-0709 for assistance</span>
        </>
      );
    case 'awaiting_receipt':
    default:
      return (
        <span className="submissions__awaiting">
          <va-icon
            class="submissions__inline-status-icon submissions__card-check"
            icon="loop"
            size="3"
          />
          <span>Awaiting receipt</span>
        </span>
      );
  }
};

const SubmissionCard = ({ submission }) => {
  return (
    <li>
      <va-card class="submission__card">
        <p className="submission__card-date">
          Submitted {formatDateParsedZoneLong(submission.submittedDate)}
        </p>
        <h3 className="submission__card-name vads-u-font-size--h3 vads-u-font-family--serif">
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
        </h3>
        <p className="submission__card-form-name vads-u-font-size--h5 vads-u-font-family--serif">
          <strong>
            {submission.formType}
            {submission.packet ? ' packet' : ''}
          </strong>
        </p>
        <p className="submission__card-status">
          <span className="submission__card-attribute-text">
            {'Confirmation: '}
          </span>
          {submission.confirmationNumber}
          <br />
          <span
            className={`submission__card-status--row ${submission.vbmsStatus}`}
          >
            <span className="submission__card-attribute-text">
              {'VBMS eFolder status: '}
            </span>
            {formatStatus(submission)}
          </span>
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
