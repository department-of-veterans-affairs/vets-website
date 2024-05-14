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
import { isLOA1 } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import { hasHealthData, personalizationEnabled } from '../selectors';
import UnregisteredAlert from './UnregisteredAlert';

const LandingPage = ({ data = {}, recordEvent = recordEventFn }) => {
  const { cards = [], hubs = [] } = data;
  const isUnverified = useSelector(isLOA1);
  const hasHealth = useSelector(hasHealthData);
  const signInService = useSelector(signInServiceName);
  const showWelcomeMessage = useSelector(personalizationEnabled);
  const showCards = hasHealth && !isUnverified;
  const serviceLabel = SERVICE_PROVIDERS[signInService]?.label;
  const unVerifiedHeadline = `Verify your identity to use your ${serviceLabel} account on My HealtheVet`;
  const noCardsDisplay = isUnverified ? (
    <IdentityNotVerified
      headline={unVerifiedHeadline}
      showHelpContent={false}
      showVerifyIdenityHelpInfo
      signInService={signInService}
    />
  ) : (
    <UnregisteredAlert />
  );

  useEffect(() => {
    if (isUnverified) {
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
      {!isUnverified && <MhvSecondaryNav />}
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
          {showCards ? <CardLayout data={cards} /> : noCardsDisplay}
        </div>
        <HubLinks hubs={hubs} />
        <NewsletterSignup />
      </div>
    </>
  );
};

LandingPage.propTypes = {
  data: PropTypes.object,
  recordEvent: PropTypes.func,
};

export default LandingPage;
