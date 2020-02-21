// Node modules.
import moment from 'moment';
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

// Derive when downtime will start and expire.
const downtimeStartAtDate = moment.utc('2020-03-01 2:00').local();
const downtimeExpiresAtDate = moment.utc('2020-03-01 2:30').local();

const config = {
  announcements: [
    {
      name: 'pre-pre-downtime',
      paths: /(.)/,
      component: PrePreDowntime,
      startsAt: downtimeStartAtDate.clone().subtract(12, 'hours'),
      expiresAt: downtimeStartAtDate.clone().subtract(1, 'hours'),
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: downtimeStartAtDate.toISOString(),
      downtimeExpiresAt: downtimeExpiresAtDate.toISOString(),
    },
    {
      name: 'pre-downtime',
      paths: /(.)/,
      component: PreDowntime,
      startsAt: downtimeStartAtDate.clone().subtract(1, 'hours'),
      expiresAt: downtimeStartAtDate.toISOString(),
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: downtimeStartAtDate.toISOString(),
    },
    {
      name: 'downtime',
      paths: /(.)/,
      component: Downtime,
      startsAt: downtimeStartAtDate.toISOString(),
      expiresAt: downtimeExpiresAtDate.toISOString(),
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
