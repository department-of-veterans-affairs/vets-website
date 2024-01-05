import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLOA1 } from '~/platform/user/selectors';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import CardLayout from './CardLayout';
import NoHealthAlert from './NoHealthAlert';
import HeaderLayoutV1 from './HeaderLayoutV1';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import Welcome from './Welcome';
import {
  hasHealthData,
  personalizationEnabled,
  selectGreetingName,
} from '../selectors';

const LandingPage = ({ data = {} }) => {
  const { cards = [], hubs = [] } = data;
  const name = useSelector(selectGreetingName);
  const isUnverified = useSelector(isLOA1);
  const hasHealth = useSelector(hasHealthData);
  const showPersonalization = useSelector(personalizationEnabled);

  const showCards = hasHealth && !isUnverified;

  const noCardsDisplay = isUnverified ? (
    <IdentityNotVerified headline="Verify your identity to access My HealtheVet tools and features" />
  ) : (
    <NoHealthAlert />
  );

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        {!showPersonalization && <HeaderLayoutV1 />}
        {showPersonalization && (
          <>
            <HeaderLayout />
            <Welcome name={name} />
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
