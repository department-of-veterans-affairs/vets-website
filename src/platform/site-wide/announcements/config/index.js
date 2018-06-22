import DashboardIntro from '../components/DashboardIntro';
import ProfileIntro from '../components/ProfileIntro';
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
      name: 'profile-intro',
      paths: /^(\/profile\/)$/,
      component: ProfileIntro,
      relatedAnnouncements: ['personalization']
    },
    {
      name: 'profile-360-intro',
      paths: /^(\/profile360\/)$/,
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
