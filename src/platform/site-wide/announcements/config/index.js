// Relative imports.
import AfghanistanPromoBanner from '../components/AfghanistanPromoBanner';
import ExploreVAModal from '../components/ExploreVAModal';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';

const config = {
  announcements: [
    {
      name: 'afghanistan-banner-v2',
      // Only the homepage (e.g. `/`).
      paths: /^(\/)$/,
      component: AfghanistanPromoBanner,
    },
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
      name: 'single-sign-on-intro',
      // All pages except the sign-in page and subroutes.
      paths: /^(?!.*\/sign-in\/).*$/,
      component: SingleSignOnInfoModal,
    },
  ],
};

export default config;
