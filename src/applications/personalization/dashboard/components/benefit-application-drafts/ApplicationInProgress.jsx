import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

const ApplicationInProgress = ({
  continueUrl,
  expirationDate,
  formId,
  formTitle,
  lastOpenedDate,
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
            <p>Last opened on: {lastOpenedDate}</p>
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
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaUseExperimentalFrontend}>
        <Toggler.Enabled>
          <div
            className="vads-u-width--full vads-u-margin-bottom--3"
            data-testid="application-in-progress"
          >
            <va-card>
              <div className="vads-u-padding--1">{content}</div>
            </va-card>
          </div>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <div
            className="vads-u-display--flex vads-u-margin-bottom--3"
            data-testid="application-in-progress"
          >
            <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5">
              {content}
            </div>
          </div>
        </Toggler.Disabled>
      </Toggler>
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
  // The display-ready date when the application was last opened by the user
  lastOpenedDate: PropTypes.string.isRequired,
  // String to show at the very top of the component, usually `Form ${formId}`
  presentableFormId: PropTypes.string.isRequired,
};

export default ApplicationInProgress;
