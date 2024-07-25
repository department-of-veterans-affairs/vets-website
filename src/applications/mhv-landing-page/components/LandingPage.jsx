import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  renderMHVDowntime,
  MhvSecondaryNav,
} from '@department-of-veterans-affairs/mhv/exports';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import HelpdeskInfo from './HelpdeskInfo';
import LandingPageAlerts from './LandingPageAlerts';
import CardLayout from './CardLayout';
import {
  isLOA3,
  isVAPatient,
  personalizationEnabled,
  helpdeskInfoEnabled,
  hasMhvAccount,
  hasMhvBasicAccount,
  showVerifyAndRegisterAlert as showVerifyAndRegisterAlertFn,
} from '../selectors';

const LandingPage = ({
  data = {},
  recordEvent = recordEventFn,
  showVerifyAndRegisterAlert = showVerifyAndRegisterAlertFn,
}) => {
  const { cards = [], hubs = [] } = data;
  const verified = useSelector(isLOA3);
  const registered = useSelector(isVAPatient) && verified;
  const signInService = useSelector(signInServiceName);
  const userHasMhvAccount = useSelector(hasMhvAccount);
  const userHasMhvBasicAccount = useSelector(hasMhvBasicAccount);
  const showWelcomeMessage = useSelector(personalizationEnabled);
  const showHelpdeskInfo = useSelector(helpdeskInfoEnabled) && registered;
  const showsVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const serviceLabel = SERVICE_PROVIDERS[signInService]?.label;
  const unVerifiedHeadline = `Verify your identity to use your ${serviceLabel} account on My HealtheVet`;

  useEffect(() => {
    if (!verified) {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': unVerifiedHeadline,
        'alert-box-status': 'continue',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {registered && <MhvSecondaryNav />}
      <div
        className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
        data-testid="landing-page-container"
      >
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <DowntimeNotification
            dependencies={[externalServices.mhvPlatform]}
            render={renderMHVDowntime}
          />
          <HeaderLayout showWelcomeMessage={showWelcomeMessage} />
          <LandingPageAlerts
            registered={registered}
            verified={verified}
            userHasMhvAccount={userHasMhvAccount}
            userHasMhvBasicAccount={userHasMhvBasicAccount}
            showsVerifyAndRegisterAlert={showsVerifyAndRegisterAlert}
            signInService={signInService}
            unVerifiedHeadline={unVerifiedHeadline}
          />
          {registered && <CardLayout data={cards} />}
        </div>
        {showHelpdeskInfo && (
          <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
            <div className="vads-l-row vads-u-margin-top--3">
              <div className="vads-l-col medium-screen:vads-l-col--8">
                <HelpdeskInfo />
              </div>
            </div>
          </div>
        )}
        <HubLinks hubs={hubs} />
        <NewsletterSignup />
      </div>
    </>
  );
};

LandingPage.propTypes = {
  data: PropTypes.object,
  recordEvent: PropTypes.func,
  showVerifyAndRegisterAlert: PropTypes.func,
};

export default LandingPage;
