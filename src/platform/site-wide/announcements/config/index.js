// Node modules.
import moment from 'moment';
// Relative imports.
import Downtime from '../components/Downtime';
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import PreDowntime from '../components/PreDowntime';
import PrePreDowntime from '../components/PrePreDowntime';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeVAOSModal from '../components/WelcomeVAOSModal';

// Derive when downtime will start and expire.
const downtimeStartAtDate = moment.utc('2020-04-25T13:00:00.000Z').local();
const downtimeExpiresAtDate = moment.utc('2020-04-26T13:00:00.000Z').local();

const config = {
  announcements: [
    {
      name: `pre-pre-downtime-${downtimeStartAtDate.toISOString()}`,
      paths: /(.)/,
      component: PrePreDowntime,
      startsAt: downtimeStartAtDate.clone().subtract(5, 'days'),
      expiresAt: downtimeStartAtDate.clone().subtract(1, 'hours'),
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: downtimeStartAtDate.toISOString(),
      downtimeExpiresAt: downtimeExpiresAtDate.toISOString(),
    },
    {
      name: `pre-downtime-${downtimeStartAtDate.toISOString()}`,
      paths: /(.)/,
      component: PreDowntime,
      startsAt: downtimeStartAtDate.clone().subtract(1, 'hours'),
      expiresAt: downtimeStartAtDate.toISOString(),
      // The following key-value pairs are just used as props, not in selectors.js.
      downtimeStartsAt: downtimeStartAtDate.toISOString(),
    },
    {
      name: `downtime-${downtimeStartAtDate.toISOString()}`,
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
    },
    {
      name: 'welcome-to-new-vaos',
      paths: /^\/health-care\/schedule-view-va-appointments\/appointments\/$/,
      component: WelcomeVAOSModal,
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
      name: 'single-sign-on-intro',
      paths: /(.)/,
      component: SingleSignOnInfoModal,
    },
  ],
};

export default config;
