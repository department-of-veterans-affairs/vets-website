import DashboardIntro from '../components/DashboardIntro';
import Profile360Intro from '../components/Profile360Intro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import ClaimIncreaseBanner from '../components/ClaimIncreaseBanner';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';

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
      name: 'dashboard-intro',
      paths: isBrandConsolidationEnabled()
        ? /^(\/my-va\/)$/
        : /^(\/dashboard\/)$/,
      component: DashboardIntro,
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
