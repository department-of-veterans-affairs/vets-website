// Relative imports.
import HomepageRedesignModal from '../components/HomepageRedesignModal';

const config = {
  announcements: [
    {
      name: 'new-homepage',
      // Homepage only
      paths: /^\/$/,
      component: HomepageRedesignModal,
      disabled: false,
      showEverytime: true,
    },
  ],
};

export default config;
