// Relative imports.
import AfghanistanPromoBanner from '../components/AfghanistanPromoBanner';
import ExploreVAModal from '../components/ExploreVAModal';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';

const config = {
  announcements: [
    {
      name: 'afghanistan-banner-v2',
      // All pages.
      paths: /(.)/,
      component: AfghanistanPromoBanner,
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
