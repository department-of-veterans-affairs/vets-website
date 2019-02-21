import FindVABenefitsIntro from '../components/FindVABenefitsIntro';
import Profile360Intro from '../components/Profile360Intro';
import PersonalizationBanner from '../components/PersonalizationBanner';
import ClaimIncreaseBanner from '../components/ClaimIncreaseBanner';
import VAPlusVetsModal from '../components/VAPlusVetsModal';
import WelcomeToNewVAModal from '../components/WelcomeToNewVAModal';
import AllClaimsBetaBanner from '../components/AllClaimsBetaBanner';

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
      name: 'welcome-to-new-va',
      paths: /^\/$/,
      component: WelcomeToNewVAModal,
      disabled: !WelcomeToNewVAModal.isEnabled(),
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
      name: 'all-claims',
      paths: /disability\/how-to-file-claim\/$/,
      component: AllClaimsBetaBanner,
      showEverytime: true,
    },
    {
      name: 'claim-increase',
      paths: /disability-benefits\/apply\/$/,
      component: ClaimIncreaseBanner,
    },
    {
      name: 'claim-increase',
      paths: /^\/$/,
      component: ClaimIncreaseBanner,
    },
    {
      name: 'personalization',
      paths: /(.)/,
      component: PersonalizationBanner,
    },
  ],
};

export default config;
