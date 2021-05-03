// Relative imports.
import ExploreVAModal from '../components/ExploreVAModal';
import SingleSignOnInfoModal from '../components/SingleSignOnInfoModal';
import VAMCWelcomeModal, { VAMC_PATHS } from '../components/VAMCWelcomeModal';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeVAOSModal from '../components/WelcomeVAOSModal';
import CovidVaccineSignUp from '../components/CovidVaccineSignUp';

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
      name: 'explore-va',
      paths: /(.)/,
      component: ExploreVAModal,
      disabled: !ExploreVAModal.isEnabled(),
      showEverytime: true,
    },
    {
      name: 'covid-vaccine-signup',
      paths: /^(\/)$/,
      component: CovidVaccineSignUp,
    },
    {
      name: 'welcome-to-new-vaos',
      paths: /^\/health-care\/schedule-view-va-appointments\/appointments\/$/,
      component: WelcomeVAOSModal,
    },
    {
      name: 'pittsburgh-vamc',
      paths: VAMC_PATHS.PITTSBURGH,
      component: VAMCWelcomeModal,
      region: 'Pittsburgh',
    },
    {
      name: 'single-sign-on-intro',
      // display for everything except the sign-in page and subroutes
      paths: /^(?!.*\/sign-in\/).*$/,
      component: SingleSignOnInfoModal,
    },
  ],
};

export default config;
