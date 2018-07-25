import DashboardIntro from '../components/DashboardIntro';
import Profile360Intro from '../components/Profile360Intro';
import PersonalizationBanner from '../components/PersonalizationBanner';

const config = {
  announcements: [
    {
      name: 'dashboard-intro',
      paths: /^(\/dashboard\/)$/,
      component: DashboardIntro,
      relatedAnnouncements: ['personalization']
    },
    {
      name: 'profile-360-intro',
      paths: /^(\/profile\/)$/,
      component: Profile360Intro,
      relatedAnnouncements: ['personalization']
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner
    }
  ]
};

export default config;
