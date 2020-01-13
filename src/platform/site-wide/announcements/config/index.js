// Node modules.
import moment from 'moment-timezone';
// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import Profile360Intro from '../components/Profile360Intro';
import ScheduledMaintenance from '../components/ScheduledMaintenance';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';

const scheduledMaintenance = {
  name: 'scheduled-maintenance',
  paths: /(.)/,
  component: ScheduledMaintenance,
  // This is just used as a prop and not in selectors.
  downtimeStartsAt: moment.tz('2020-01-11 22:00', 'America/New_York'),
  expiresAt: moment.tz('2020-01-12 00:01', 'America/New_York'),
};

const scheduledMaintenanceMessage = ScheduledMaintenance.deriveMessage(
  scheduledMaintenance.downtimeStartsAt,
  scheduledMaintenance.expiresAt,
);

// The scheduled maintenance announcement has three different states, each of which should be separately dismissible
// This spoofs it by deriving the announcement's name property in the config.
if (scheduledMaintenanceMessage) {
  const stateId = scheduledMaintenanceMessage.slice(1, 10);
  scheduledMaintenance.name = `scheduled-maintenance-${stateId}`;
} else {
  scheduledMaintenance.disabled = true;
}

const config = {
  announcements: [
    {
      name: 'brand-consolidation-va-plus-vets',
      paths: /(.)/,
      component: VAPlusVetsModal,
      disabled: !VAPlusVetsModal.isEnabled(),
      showEverytime: true,
    },
    scheduledMaintenance,
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
