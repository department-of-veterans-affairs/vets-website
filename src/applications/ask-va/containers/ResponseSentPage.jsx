import { focusElement } from 'platform/utilities/ui';
import React, { useEffect, useRef } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import cookie from 'js-cookie';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import BreadCrumbs from '../components/BreadCrumbs';
import NeedHelpFooter from '../components/NeedHelpFooter';
import manifest from '../manifest.json';

const ResponseSentPage = () => {
  const alertRef = useRef(null);
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

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

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

  return !isLoadingFeatureFlags ? (
    <div className="row vads-u-padding-x--1">
      <BreadCrumbs currentLocation="/response-sent" />
      <div className="usa-width-two-thirds medium-8 columns vads-u-padding--0">
        <h1 className="vads-u-font-family--serif vads-u-margin-bottom--5">
          Response sent
        </h1>
        <va-alert status="success" visible ref={alertRef} slim>
          <p className="vads-u-margin-y--0">
            Your response was submitted successfully.
          </p>
        </va-alert>

        <p className="vads-u-margin-bottom--3 vads-u-margin-top--3">
          Thank you for sending a response. Your question has now been reopened.
        </p>
        <p className="vads-u-margin-bottom--3">
          You should receive a reply within 7 business days. If we need more
          information to answer your question, we’ll contact you.
        </p>
        <div className="vads-u-margin-bottom--7 vads-u-margin-top--6">
          <va-link-action
            href={`${manifest.rootUrl}`}
            text="Return to Ask VA Inbox"
            type="secondary"
          />
        </div>
        <NeedHelpFooter />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ResponseSentPage;
