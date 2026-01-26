import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import LandingPage from '../../mhv-landing-page/components/LandingPage';
import ErrorBoundary from '../../mhv-landing-page/components/ErrorBoundary';
import {
  resolveLandingPageLinks,
  resolveUnreadMessageAriaLabel,
} from '../../mhv-landing-page/utilities/data';

const MhvDemoLandingPageContainer = () => {
  const { featureToggles } = useSelector(state => state);

  // Static mock data for demo purposes
  const unreadMessageCount = 3;
  const ssoe = true;
  const registered = true;
  const unreadMessageAriaLabel = resolveUnreadMessageAriaLabel(
    unreadMessageCount,
  );

  const data = useMemo(
    () => {
      const resolvedData = resolveLandingPageLinks(
        ssoe,
        featureToggles,
        unreadMessageAriaLabel,
        registered,
      );

      // Override links to point to demo routes
      const demoCards = resolvedData.cards.map(card => {
        if (card.title === 'Medical records') {
          return {
            ...card,
            links: card.links.map(link => {
              if (link.href === '/my-health/medical-records/') {
                return {
                  ...link,
                  href: '/sign-in/mhv-demo-mode-medical-records',
                };
              }
              return link;
            }),
          };
        }
        return card;
      });

      return { ...resolvedData, cards: demoCards };
    },
    [featureToggles, unreadMessageAriaLabel],
  );

  useEffect(() => {
    focusElement('h1');
  }, []);

  if (featureToggles.loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-landing-page-loading"
          message="Please wait..."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LandingPage data={data} />
    </ErrorBoundary>
  );
};

export default MhvDemoLandingPageContainer;
