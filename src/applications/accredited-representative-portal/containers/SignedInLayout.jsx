import React from 'react';
import { Outlet } from 'react-router-dom';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  const { useToggleLoadingValue, TOGGLE_NAMES } = useFeatureToggle();

  const isLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );

  // TODO: Update with permissions check
  const hasPOAPermissions = true;

  if (isLoading) {
    return (
      <div
        className="vads-u-margin-y--5"
        data-testid="signed-in-layout-pilot-toggle-loading"
      >
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
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
