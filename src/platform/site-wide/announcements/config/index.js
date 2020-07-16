// Node modules.
import moment from 'moment';
// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeVAOSModal from '../components/WelcomeVAOSModal';

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
