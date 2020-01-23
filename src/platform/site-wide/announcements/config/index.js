import environment from 'platform/utilities/environment';

// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import Profile360Intro from '../components/Profile360Intro';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';

import TestPromoBanner from '../components/TestPromoBanner';

const config = {
  announcements: [
    {
      name: 'brand-consolidation-va-plus-vets',
      paths: /(.)/,
      component: VAPlusVetsModal,
      disabled: !VAPlusVetsModal.isEnabled(),
      showEverytime: true,
    },
    {
      name: 'explore-va',
      paths: /(.)/,
      component: ExploreVAModal,
      disabled: !ExploreVAModal.isEnabled(),
      showEverytime: true,
      relatedAnnouncements: ['welcome-to-new-va'],
    },
    {
      name: 'welcome-to-new-va',
      paths: /^\/$/,
      component: WelcomeToNewVAModal,
    },
    {
      name: 'test-promo-banner',
      paths: /^\/$/,
      component: TestPromoBanner,
      disabled: environment.isProduction(),
    },
    {
      name: 'find-benefits-intro',
      paths: /^(\/my-va\/)$/,
      component: FindVABenefitsIntro,
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'profile-360-intro',
      paths: /^(\/profile\/)$/,
      component: Profile360Intro,
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner,
    },
  ],
};

export default config;
