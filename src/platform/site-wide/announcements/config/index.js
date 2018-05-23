import DashboardIntro from '../components/DashboardIntro';
import ProfileIntro from '../components/ProfileIntro';
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
      name: 'profile-intro',
      paths: /^(\/profile\/)$/,
      component: ProfileIntro,
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
