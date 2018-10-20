import DashboardIntro from '../components/DashboardIntro';
import Profile360Intro from '../components/Profile360Intro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import ClaimIncreaseBanner from '../components/ClaimIncreaseBanner';
import BrandConsolidationModal from '../components/BrandConsolidationModal';
import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';

const config = {
  announcements: [
    {
      name: 'brand-consolidation',
      paths: /(.)/,
      component: BrandConsolidationModal,
      disabled: !isBrandConsolidationEnabled(),
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
