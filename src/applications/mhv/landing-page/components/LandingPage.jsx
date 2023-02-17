import React from 'react';
import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import demodata from '../demodata.json';

const LandingPage = () => {
  return (
    <div className="vads-u-margin-y--5">
      <main>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <HeaderLayout />
          <CardLayout data={demodata.cards} />
        </div>
      </main>
      <HubLinks />
    </div>
  );
};

export default LandingPage;
