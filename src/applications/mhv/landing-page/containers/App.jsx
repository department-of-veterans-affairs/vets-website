import React from 'react';
// import { useSelector } from 'react-redux';
import CardLayout from '../components/CardLayout';
import HeaderLayout from '../components/HeaderLayout';
import HubLinks from '../components/HubLinks';
import demodata from '../demodata.json';

// import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';

const App = () => {
  // const { featureToggles, user } = useSelector(state => state);
  // const appEnabled = isLandingPageEnabledForUser(
  //   featureToggles,
  //   user?.profile?.signIn?.serviceName,
  // );
  // console.log({ appEnabled });
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

export default App;
