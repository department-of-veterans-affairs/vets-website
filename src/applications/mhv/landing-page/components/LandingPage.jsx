import React from 'react';
import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';

const LandingPage = ({ data = null }) => {
  const { cards = null, hubs } = data;

  return (
    <div className="vads-u-margin-y--5" data-testid="landing-page-container">
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <HeaderLayout />
        <CardLayout data={cards} />
      </div>
      <HubLinks hubs={hubs} />
    </div>
  );
};

// LandingPage.

export default LandingPage;
