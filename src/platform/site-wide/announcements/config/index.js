// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';

const config = {
  announcements: [
    {
      name: 'explore-va',
      // All pages.
      paths: /(.)/,
      component: ExploreVAModal,
      disabled: !ExploreVAModal.isEnabled(),
      showEverytime: true,
    },
  ],
};

export default config;
