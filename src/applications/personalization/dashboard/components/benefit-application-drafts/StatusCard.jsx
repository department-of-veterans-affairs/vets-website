import React from 'react';
import PropTypes from 'prop-types';

import { formatFormTitle, formatSubmissionDisplayStatus } from '../../helpers';

const QuestionsContent = () => (
  <p>
    If you have questions, call us at <va-telephone contact="8008271000" /> (
    <va-telephone contact="711" tty />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);

const ReceivedContent = ({ lastSavedDate }) => (
  <>
    <p className="vads-u-margin-y--0">Received on: {lastSavedDate}</p>
    <p>
      Next step: We’ll review your form. If we need more information, we’ll
      contact you.
    </p>
    <QuestionsContent />
  </>
);
ReceivedContent.propTypes = {
  lastSavedDate: PropTypes.string.isRequired,
};

const InProgressContent = () => (
  <>
    <p>
      Next step: We’ll confirm that we’ve received your form. This can take up
      to 10 days.
    </p>
    <QuestionsContent />
  </>
);

const ActionNeededContent = ({ lastSavedDate }) => (
  <>
    <p className="vads-u-margin-y--0">Submission failed on: {lastSavedDate}</p>
    <va-alert
      slim="true"
      status="error"
      disable-analytics="false"
      visible="true"
      closeable="false"
      full-width="false"
      class="hydrated"
    >
      <p className="vads-u-margin-y--0">
        We’re sorry. There was a problem with our system. We couldn’t process
        this form. Call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-alert>
  </>
);
ActionNeededContent.propTypes = {
  lastSavedDate: PropTypes.string.isRequired,
};

// TODO: fialize markup and desigs for other status types
const StatusCard = ({
  formId,
  formTitle,
  lastSavedDate,
  submittedDate,
  presentableFormId,
  status,
}) => {
  const content = (
    <>
      <div className="vads-u-width--full">
        <h3 aria-describedby="21-0845" className="vads-u-margin-top--0">
          <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
            {formatSubmissionDisplayStatus(status)}
          </span>
          <span className="vads-u-display--block vads-u-font-size--h3 vads-u-margin-top--2">
            {formatFormTitle(formTitle)}
          </span>
        </h3>
        <p
          id={formId}
          className="vads-u-text-transform--uppercase vads-u-margin-bottom--2"
        >
          {/* TODO: rethink our helpers for presentable form ID */}
          VA {presentableFormId.replace(/\bFORM\b/, 'Form')}
        </p>
        <p className="vads-u-margin-bottom--0">Submitted on: {submittedDate}</p>
        {status === 'inProgress' && <InProgressContent />}
        {status === 'received' && (
          <ReceivedContent lastSavedDate={lastSavedDate} />
        )}
        {status === 'actionNeeded' && (
          <ActionNeededContent lastSavedDate={lastSavedDate} />
        )}
      </div>
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="submitted-application"
    >
      <va-card>
        <div className="vads-u-padding--1">{content}</div>
      </va-card>
    </div>
  );
};

StatusCard.propTypes = {
  // The Form ID for Google Analytics tracking purposes
  formId: PropTypes.string.isRequired,
  // String to use as the main "headline" of the component
  formTitle: PropTypes.string.isRequired,
  // The display-ready date when the application was last updated by the user
  lastSavedDate: PropTypes.string.isRequired,
  presentableFormId: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['inProgress', 'actionNeeded', 'received'])
    .isRequired,
  submittedDate: PropTypes.string.isRequired,
};

export default StatusCard;
