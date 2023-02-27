import React from 'react';
import { useSelector } from 'react-redux';
import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import data, { resolveToggleLink } from '../utilities/data';

const LandingPage = () => {
  const { featureToggles } = useSelector(state => state);
  const cards = data.cards.map(c => {
    const { links, ...rest } = c;
    const resolvedLinks = links.map(l => resolveToggleLink(l, featureToggles));
    return { links: resolvedLinks, ...rest };
  });

  return (
    <div className="vads-u-margin-y--5" data-testid="landing-page-container">
      <main>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <HeaderLayout />
          <CardLayout data={cards} />
        </div>
      </main>
      <HubLinks />
    </div>
  );
};

export default LandingPage;
