import React from 'react';
import PropTypes from 'prop-types';

import {
  recordDashboardClick,
  formatFormTitle,
} from '~/applications/personalization/dashboard/helpers';

const Draft = ({
  continueUrl,
  expirationDate,
  formId,
  formTitle,
  lastSavedDate,
  presentableFormId,
}) => {
  const content = (
    <>
      <div className="vads-u-width--full">
        <h3 className="vads-u-margin-top--0">
          <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
            Draft
          </span>
          <span className="vads-u-display--block vads-u-font-size--h3 vads-u-margin-top--1p5">
            {formatFormTitle(formTitle)}
          </span>
        </h3>
        <p
          id={formId}
          className="vads-u-text-transform--uppercase vads-u-margin-top--0p5 vads-u-margin-bottom--2"
        >
          {/* TODO: rethink our helpers for presentable form ID */}
          VA {presentableFormId.replace(/\bFORM\b/, 'Form')}
        </p>
        <div className="vads-u-display--flex">
          <span className="vads-u-margin-right--1 vads-u-margin-top--0p5">
            <va-icon icon="error" size={3} />
          </span>
          <span className="sr-only">Alert: </span>
          <div>
            <p className="vads-u-margin-top--0">
              Application expires on: {expirationDate}
            </p>
            <p>Last saved on: {lastSavedDate}</p>
          </div>
        </div>
      </div>
      <va-link
        active
        text="Continue your application"
        href={continueUrl}
        onClick={recordDashboardClick(formId, 'continue-button')}
      />
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="application-in-progress"
    >
      <va-card>
        <div>{content}</div>
      </va-card>
    </div>
  );
};

Draft.propTypes = {
  // The URL that lets the user continue their application
  continueUrl: PropTypes.string.isRequired,
  // The display-ready application expiration date
  expirationDate: PropTypes.string.isRequired,
  // The Form ID for Google Analytics tracking purposes
  formId: PropTypes.string.isRequired,
  // String to use as the main "headline" of the component
  formTitle: PropTypes.string.isRequired,
  // The display-ready date when the application was last updated by the user
  lastSavedDate: PropTypes.string.isRequired,
  // String to show at the very top of the component, usually `Form ${formId}`
  presentableFormId: PropTypes.string.isRequired,
};

export default Draft;
