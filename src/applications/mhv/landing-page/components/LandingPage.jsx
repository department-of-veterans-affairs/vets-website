import React from 'react';
import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
// import PriorityGroup from './PriorityGroup';

const LandingPage = ({ data = null }) => {
  const { cards = null, hubs } = data;

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <HeaderLayout />
        {/* <PriorityGroup /> */}
        <CardLayout data={cards} />
      </div>
      <HubLinks hubs={hubs} />
      <NewsletterSignup />
    </div>
  );
};

// LandingPage.

export default LandingPage;
