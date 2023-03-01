import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import { resolveLandingPageLinks } from '../utilities/data';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const LandingPage = () => {
  const fullState = useSelector(state => state);

  const data = useMemo(
    () => {
      const authdWithSSOe = isAuthenticatedWithSSOe(fullState) || false;
      return resolveLandingPageLinks(authdWithSSOe, fullState.featureToggles);
    },
    [fullState.featureToggles, fullState?.user?.profile?.session?.ssoe],
  );

  if (data) {
    const { cards = null, hubs } = data;

    return (
      <div className="vads-u-margin-y--5" data-testid="landing-page-container">
        <main>
          <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
            <HeaderLayout />
            <CardLayout data={cards} />
          </div>
        </main>
        <HubLinks hubs={hubs} />
      </div>
    );
  }
  return <></>;
};

export default LandingPage;
