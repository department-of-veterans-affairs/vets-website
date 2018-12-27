import DashboardIntro from '../components/DashboardIntro';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import Profile360Intro from '../components/Profile360Intro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import ClaimIncreaseBanner from '../components/ClaimIncreaseBanner';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';
import environment from 'platform/utilities/environment';

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
      name: 'welcome-to-new-va',
      paths: /^\/$/,
      component: WelcomeToNewVAModal,
      disabled: !WelcomeToNewVAModal.isEnabled(),
    },
    {
      name: 'dashboard-intro',
      paths: /^(\/my-va\/)$/,
      component: DashboardIntro,
      disabled: !environment.isProduction(),
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'find-benefits-intro',
      paths: /^(\/my-va\/)$/,
      component: FindVABenefitsIntro,
      disabled: environment.isProduction(),
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'profile-360-intro',
      paths: /^(\/profile\/)$/,
      component: Profile360Intro,
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'claim-increase',
      paths: /disability-benefits\/apply\/$/,
      component: ClaimIncreaseBanner,
    },
    {
      name: 'claim-increase',
      paths: /^\/$/,
      component: ClaimIncreaseBanner,
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner,
    },
  ],
};

export default config;
