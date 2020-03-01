// Relative imports.
import Downtime from '../components/Downtime';
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import PreDowntime from '../components/PreDowntime';
import PrePreDowntime from '../components/PrePreDowntime';
import Profile360Intro from '../components/Profile360Intro';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';

const config = {
  announcements: [
    {
      name: 'pre-pre-downtime',
      paths: /(.)/,
      component: PrePreDowntime,
      startsAt: '2020-02-29 09:00',
      expiresAt: '2020-02-29 20:00',
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: '2020-02-29 21:00',
      downtimeExpiresAt: '2020-02-29 21:30',
    },
    {
      name: 'pre-downtime',
      paths: /(.)/,
      component: PreDowntime,
      startsAt: '2020-02-29 20:00',
      expiresAt: '2020-02-29 21:00',
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: '2020-02-29 21:00',
    },
    {
      name: 'downtime',
      paths: /(.)/,
      component: Downtime,
      startsAt: '2020-02-29 21:00',
      expiresAt: '2020-02-29 21:30',
    },
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
      name: 'pittsburgh-vamc',
      paths: VAMC_PATHS.PITTSBURGH,
      component: VAMCWelcomeModal,
      region: 'Pittsburgh',
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
