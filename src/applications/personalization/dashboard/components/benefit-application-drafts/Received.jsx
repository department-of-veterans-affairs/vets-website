import React from 'react';
import PropTypes from 'prop-types';

import { formatFormTitle } from '../../helpers';

const Received = ({ formId, formTitle, lastSavedDate, submittedDate }) => {
  const content = (
    <>
      <div className="vads-u-width--full">
        <span className="usa-label">Received</span>
        <h3
          aria-describedby={formId}
          className="vads-u-font-size--h3 vads-u-margin-top--2"
        >
          {formatFormTitle(formTitle)}
        </h3>
        <p
          id={formId}
          className="vads-u-text-transform--uppercase vads-u-margin-bottom--2"
        >
          VA Form {formId}
        </p>
        <p className="vads-u-margin-bottom--0">Submitted on: {submittedDate}</p>
        <p className="vads-u-margin-y--0">Received on: {lastSavedDate}</p>
        <p>
          Next step: We’ll review your form. If we need more information, we’ll
          contact you.
        </p>
        <p>
          If you have questions, call us at{' '}
          <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="benefit-application-received"
    >
      <va-card>
        <div className="vads-u-padding--1">{content}</div>
      </va-card>
    </div>
  );
};

Received.propTypes = {
  // The Form ID for Google Analytics tracking purposes
  formId: PropTypes.string.isRequired,
  // String to use as the main "headline" of the component
  formTitle: PropTypes.string.isRequired,
  // The display-ready date when the application was last updated by the user
  lastSavedDate: PropTypes.string.isRequired,
  submittedDate: PropTypes.string.isRequired,
};

export default Received;
