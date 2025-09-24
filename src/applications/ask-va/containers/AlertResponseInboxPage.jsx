import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import cookie from 'js-cookie';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ResponseInboxPage from './ResponseInboxPage';

// Adding this component so clean up when removing the alert flag is easier
// TODO: Delete this component when toggle is no longer needed
const AlertResponseInboxPage = () => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  // manually set cookie to true to force new VA.gov experience
  const isAppEnabledViaCookie = cookie.get('askVaEnableAppOverride') === 'true';

  const toggleOldPortalAlert = TOGGLE_NAMES.askVaAlertLinkToOldPortal;
  const isOldPortalAlertEnabled = useToggleValue(toggleOldPortalAlert);
  const isLoadingFeatureFlags = useToggleLoadingValue(toggleOldPortalAlert);
  const showAlertAndHideForm =
    !isLoadingFeatureFlags && isOldPortalAlertEnabled && !isAppEnabledViaCookie;

  if (showAlertAndHideForm) {
    return (
      <VaAlert
        className="vads-u-margin-x--2 vads-u-margin-top--3  vads-u-margin-bottom--9"
        close-btn-aria-label="Close notification"
        status="warning"
        uswds
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          This version of Ask VA isn’t working right now
        </h2>
        <p className="vads-u-margin-y--0">
          We’re making some updates to Ask VA on VA.gov. We’re sorry it’s not
          working right now. You can still use the{' '}
          <a href="https://ask.va.gov/">previous version of Ask VA</a>
        </p>
      </VaAlert>
    );
  }

  return !isLoadingFeatureFlags ? <ResponseInboxPage /> : <></>;
};

export default AlertResponseInboxPage;
