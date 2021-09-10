// Relative imports.
import AfghanistanPromoBanner from '../components/AfghanistanPromoBanner';
import ExploreVAModal from '../components/ExploreVAModal';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import environment from 'platform/utilities/environment';

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
  ],
};

// Add the Afghanistan banner on non-prod environments.
if (!environment.isProduction()) {
  config.announcements.unshift({
    name: 'afghanistan-banner',
    // Only the homepage (e.g. `/`).
    paths: /^(\/)$/,
    component: AfghanistanPromoBanner,
  });
}

export default config;
