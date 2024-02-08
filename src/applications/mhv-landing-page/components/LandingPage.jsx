import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { renderMHVDowntime } from '@department-of-veterans-affairs/mhv/exports';
import { isLOA1 } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import CardLayout from './CardLayout';
import NoHealthAlert from './NoHealthAlert';
import HeaderLayoutV1 from './HeaderLayoutV1';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import WelcomeContainer from '../containers/WelcomeContainer';
import { hasHealthData, personalizationEnabled } from '../selectors';

const LandingPage = ({ data = {} }) => {
  const { cards = [], hubs = [] } = data;
  const isUnverified = useSelector(isLOA1);
  const hasHealth = useSelector(hasHealthData);
  const signInService = useSelector(signInServiceName);
  const showPersonalization = useSelector(personalizationEnabled);

  const showCards = hasHealth && !isUnverified;

  const serviceLabel = SERVICE_PROVIDERS[signInService]?.label;
  const unVerifiedHeadline = `Verify your identity to use your ${serviceLabel} account on My HealtheVet`;
  const noCardsDisplay = isUnverified ? (
    <IdentityNotVerified
      headline={unVerifiedHeadline}
      showHelpContent={false}
    />
  ) : (
    <NoHealthAlert />
  );

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <DowntimeNotification
          dependencies={[externalServices.mhvPlatform]}
          render={renderMHVDowntime}
        />
        {!showPersonalization && <HeaderLayoutV1 />}
        {showPersonalization && (
          <>
            <HeaderLayout />
            <WelcomeContainer />
          </>
        )}
        {showCards ? <CardLayout data={cards} /> : noCardsDisplay}
      </div>
      <HubLinks hubs={hubs} />
      <NewsletterSignup />
    </div>
  );
};

LandingPage.propTypes = {
  data: PropTypes.object,
};

export default LandingPage;
