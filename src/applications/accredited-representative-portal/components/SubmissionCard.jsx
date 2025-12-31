import React from 'react';
import PropTypes from 'prop-types';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';
import { differenceInDays } from 'date-fns';

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

const getFormName = formType => {
  switch (formType) {
    case '21-686c':
    case '21-526EZ':
      return `VA ${formType}`;
    case '21-0966':
      return `VA Form ${formType}`;
    default:
      return `VA ${formType}`;
  }
};

const getBenefitName = benefitType => {
  switch (benefitType) {
    case 'compensation':
      return 'Disability Compensation (VA Form 21-526EZ)';
    case 'pension':
      return 'Pension (VA Form 21P-527EZ)';
    case 'survivor':
      return 'Survivors pension and/or dependency and indemnity compensation (DIC) (VA Form 21P-534 or VA Form 21P-534EZ)';
    default:
      return '';
  }
};

const SubmissionCard = ({ submission }) => {
  const formattedSubmittedDate = formatDateParsedZoneLong(
    submission.submittedDate,
  );
  const isITF = submission.formType === '21-0966';
  let daysTilExpiration;
  let showWarningIcon;
  if (isITF) {
    daysTilExpiration =
      365 - differenceInDays(new Date(), new Date(formattedSubmittedDate));
    showWarningIcon = daysTilExpiration <= 60;
  }
  return (
    <li>
      <va-card class="submission__card">
        <p className="submission__card-date">
          Submitted {formattedSubmittedDate}
        </p>
        <h3 className="submission__card-name vads-u-font-size--h3 vads-u-font-family--serif">
          {submission.lastName}, {submission.firstName}
        </h3>
        <p className="submission__card-form-name vads-u-font-size--h5 vads-u-font-family--serif">
          <strong>
            {getFormName(submission.formType)}
            {submission.packet ? ' packet' : ''}
          </strong>
        </p>
        <p className="submission__card-status">
          {submission.benefitType ? (
            <>
              <span className="submission__card-attribute-text">
                {'Benefit: '}
              </span>
              {getBenefitName(submission.benefitType)}
              <br />
            </>
          ) : (
            ''
          )}
          {isITF && (
            <>
              <span className="submission__card-attribute-text">
                ITF Date:{' '}
              </span>
              {showWarningIcon && (
                <va-icon
                  icon="warning"
                  class="submissions__inline-status-icon submissions__card-error"
                  size="3"
                />
              )}
              {formattedSubmittedDate} (Expires in {daysTilExpiration} days)
              <br />
            </>
          )}
          {!isITF && (
            <>
              {submission.confirmationNumber ? (
                <>
                  <span className="submission__card-attribute-text">
                    {'Confirmation: '}
                  </span>
                  {submission.confirmationNumber}
                  <br />
                </>
              ) : (
                ''
              )}
              <span
                className={`submission__card-status--row ${
                  submission.vbmsStatus
                }`}
              >
                <span className="submission__card-attribute-text">
                  {'VBMS eFolder status: '}
                </span>
                {formatStatus(submission)}
              </span>
            </>
          )}
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
