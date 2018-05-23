import DashboardIntro from '../components/DashboardIntro';
import ProfileIntro from '../components/ProfileIntro';
import PersonalizationBanner from '../components/PersonalizationBanner';

const config = {
  announcements: [
    {
      name: 'dashboard-intro',
      paths: /^(\/dashboard\/)$/,
      component: DashboardIntro
    },
    {
      name: 'profile-intro',
      paths: /^(\/profile\/)$/,
      component: ProfileIntro
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner
    }
  ]
};

export default config;
