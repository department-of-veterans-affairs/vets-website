import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CardLayout from './CardLayout';
import NoHealthAlert from './NoHealthAlert';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import { hasHealthData } from '../selectors';

const LandingPage = ({ data = null }) => {
  const { cards = null, hubs } = data;
  // Show the cards only for those users with health data.
  const showCards = useSelector(hasHealthData);

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <HeaderLayout />
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

// LandingPage.

export default LandingPage;
