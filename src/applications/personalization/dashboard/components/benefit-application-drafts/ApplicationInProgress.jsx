import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

const ApplicationInProgress = ({
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
        <p
          id={formId}
          className="vads-u-text-transform--uppercase vads-u-margin-y--0"
        >
          {presentableFormId}
        </p>
        <h3
          aria-describedby={formId}
          className="vads-u-font-size--h3 vads-u-margin-top--0"
        >
          {capitalize(formTitle)}
        </h3>
        <div className="vads-u-display--flex">
          <i
            aria-hidden="true"
            className="fas fa-fw fa-exclamation-circle vads-u-margin-right--1 vads-u-margin-top--0p5"
          />
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
    <DashboardWidgetWrapper>
      <div
        className="vads-u-width--full vads-u-margin-bottom--3"
        data-testid="application-in-progress"
      >
        <va-card>
          <div className="vads-u-padding--1">{content}</div>
        </va-card>
      </div>
    </DashboardWidgetWrapper>
  );
};

ApplicationInProgress.propTypes = {
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

export default ApplicationInProgress;
