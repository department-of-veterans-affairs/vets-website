import React from 'react';
import { Outlet } from 'react-router-dom';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const NotInPilotAlert = () => {
  // TODO: Add email addresses
  const questions = [
    {
      text: 'Would you like to join the pilot?',
      email: 'addAnEmail@va.gov',
      linkText: 'Contact add org here',
    },
    {
      text: 'Do you need help with SEP and other VA digital tools?',
      email: 'addAnEmail@va.gov',
      linkText: 'Contact add org here',
    },
    {
      text: 'Do you have questions about the accreditation process?',
      email: 'ogcaccreditationmailbox@va.gov',
      linkText: 'Contact OGC',
    },
  ];

  return (
    <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        <va-alert
          class="arp-full-width-alert"
          data-testid="not-in-pilot-alert"
          status="info"
          visible
        >
          <h2 data-testid="not-in-pilot-alert-heading" slot="headline">
            Accredited Representative Portal is currently in pilot
          </h2>
          <div>
            <ul data-testid="not-in-pilot-alert-description">
              {questions.map((question, index) => (
                <li key={index}>
                  <span className="arp-full-width-alert__questions">
                    {question.text}{' '}
                  </span>
                  <a href={`mailto:${question.email}`}>{question.linkText}</a>
                </li>
              ))}
            </ul>
          </div>
        </va-alert>
      </div>
    </div>
  );
};

export const NoPOAPermissionsAlert = () => {
  return (
    <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        <va-alert
          class="arp-full-width-alert"
          data-testid="no-poa-permissions-alert"
          status="error"
          visible
        >
          <h2 data-testid="no-poa-permissions-alert-heading" slot="headline">
            You do not have permission to manage power of attorney requests
          </h2>
          <div>
            <ul data-testid="no-poa-permissions-alert-description">
              <li>
                <span className="arp-full-width-alert__questions">
                  Do you have questions about gaining these permissions?{' '}
                </span>
                <a href="mailto:ogcaccreditationmailbox@va.gov">Contact OGC</a>
              </li>
            </ul>
          </div>
        </va-alert>
      </div>
    </div>
  );
};

const SignedInLayout = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isPilotToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isProduction = window.Cypress || environment.isProduction();

  // TODO: Update with permissions check
  const hasPOAPermissions = true;

  if (isPilotToggleLoading) {
    return (
      <div
        className="vads-u-margin-y--5"
        data-testid="signed-in-layout-pilot-toggle-loading"
      >
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (isProduction && !isInPilot) {
    return <NotInPilotAlert />;
  }

  if (!hasPOAPermissions) {
    return <NoPOAPermissionsAlert />;
  }

  return (
    <div className="arp-container">
      <div data-testid="signed-in-layout-content" className="vads-l-row">
        <Outlet />
      </div>
    </div>
  );
};

export default SignedInLayout;
