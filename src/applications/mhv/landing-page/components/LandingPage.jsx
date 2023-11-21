import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CardLayout from './CardLayout';
import NoHealthAlert from './NoHealthAlert';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import Welcome from './Welcome';
import {
  hasHealthData,
  selectGreetingName,
  welcomeEnabled,
} from '../selectors';

const LandingPage = ({ data = {} }) => {
  const { cards = [], hubs = [] } = data;
  const name = useSelector(selectGreetingName);
  const showCards = useSelector(hasHealthData);
  const showWelcome = useSelector(welcomeEnabled);

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <HeaderLayout />
        {showWelcome && <Welcome name={name} />}
        {showCards ? <CardLayout data={cards} /> : <NoHealthAlert />}
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
