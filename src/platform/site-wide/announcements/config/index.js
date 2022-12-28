// Relative imports.
import HomepageRedesignModal from '../components/HomepageRedesignModal';
import { AnnouncementBehavior } from '../constants';

const config = {
  announcements: [
    {
      name: 'new-homepage',
      // Homepage only
      paths: /^\/$/,
      component: HomepageRedesignModal,
      disabled: false,
      show: AnnouncementBehavior.SHOW_ONCE_PER_SESSION,
      returnFocusToDefault: true,
    },
  ],
};

export default config;
