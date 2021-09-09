// Relative imports.
import AfghanistanPromoBanner from '../components/AfghanistanPromoBanner';
import ExploreVAModal from '../components/ExploreVAModal';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';

const config = {
  announcements: [
    {
      name: 'brand-consolidation-va-plus-vets',
      // All pages.
      paths: /(.)/,
      component: VAPlusVetsModal,
      disabled: !VAPlusVetsModal.isEnabled(),
      showEverytime: true,
    },
    {
      name: 'explore-va',
      // All pages.
      paths: /(.)/,
      component: ExploreVAModal,
      disabled: !ExploreVAModal.isEnabled(),
      showEverytime: true,
    },
    {
      name: 'pittsburgh-vamc',
      paths: VAMC_PATHS.PITTSBURGH,
      component: VAMCWelcomeModal,
      region: 'Pittsburgh',
    },
    {
      name: 'single-sign-on-intro',
      // All pages except the sign-in page and subroutes.
      paths: /^(?!.*\/sign-in\/).*$/,
      component: SingleSignOnInfoModal,
    },
    {
      name: 'covid-vaccine-signup',
      // All pages.
      paths: /(.)/,
      component: AfghanistanPromoBanner,
    },
  ],
};

export default config;
