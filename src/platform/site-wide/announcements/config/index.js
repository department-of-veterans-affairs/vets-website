// Node modules.
import moment from 'moment-timezone';
// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import Profile360Intro from '../components/Profile360Intro';
import ScheduledMaintenance from '../components/ScheduledMaintenance';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import VeteransDayProclamation from '../components/VeteransDayProclamation';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';

const config = {
  announcements: [
    {
      name: 'brand-consolidation-va-plus-vets',
      paths: /(.)/,
      component: VAPlusVetsModal,
      disabled: !VAPlusVetsModal.isEnabled(),
      showEverytime: true,
    },
    {
      name: 'scheduled-maintenance',
      paths: /(.)/,
      component: ScheduledMaintenance,
      disabled: !ScheduledMaintenance.isEnabled(),
      startsAt: moment.tz('2020-01-09 13:40', 'America/New_York'),
      expiresAt: moment.tz('2020-01-10 00:01', 'America/New_York'),
    },
    {
      name: 'explore-va',
      paths: /(.)/,
      component: ExploreVAModal,
      disabled: !ExploreVAModal.isEnabled(),
      showEverytime: true,
      relatedAnnouncements: ['welcome-to-new-va'],
    },
    {
      name: 'welcome-to-new-va',
      paths: /^\/$/,
      component: WelcomeToNewVAModal,
    },
    {
      name: 'veterans-day-proclamation-edited',
      paths: /^\/$/,
      component: VeteransDayProclamation,
      expiresAt: '2019-11-12',
    },
    {
      name: 'find-benefits-intro',
      paths: /^(\/my-va\/)$/,
      component: FindVABenefitsIntro,
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'profile-360-intro',
      paths: /^(\/profile\/)$/,
      component: Profile360Intro,
      relatedAnnouncements: ['personalization'],
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner,
    },
  ],
};

export default config;
