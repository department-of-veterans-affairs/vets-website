import React from 'react';
import { useSelector } from 'react-redux';
import CardLayout from './CardLayout';
import NoHealthAlert from './NoHealthAlert';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import { hasHealthRecord } from '../selectors';

const LandingPage = ({ data = null }) => {
  const { cards = null, hubs } = data;
  const hasRecord = useSelector(hasHealthRecord);

  return (
    <div
      className="vads-u-margin-y--3 medium-screen:vads-u-margin-y--5"
      data-testid="landing-page-container"
    >
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <HeaderLayout />
        {hasRecord ? <CardLayout data={cards} /> : <NoHealthAlert />}
      </div>
      <HubLinks hubs={hubs} />
      <NewsletterSignup />
    </div>
  );
};

// LandingPage.

export default LandingPage;
