// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import TestModal from '../components/TestModal';
import { AnnouncementBehavior } from '../constants';

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
    {
      name: 'testing-announcements-once-per-session',
      paths: /test-announcement--once-per-session$/,
      component: TestModal,
      disabled: false,
      show: AnnouncementBehavior.SHOW_ONCE_PER_SESSION,
    },
    {
      name: 'testing-announcements-once',
      paths: /test-announcement--once$/,
      component: TestModal,
      disabled: false,
      show: AnnouncementBehavior.SHOW_ONCE,
    },
    {
      name: 'testing-announcements-every-time',
      paths: /test-announcement--every-time$/,
      component: TestModal,
      disabled: false,
      show: AnnouncementBehavior.SHOW_EVERY_TIME,
    },
  ],
};

export default config;
