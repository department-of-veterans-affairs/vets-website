import TermsOfUse from './containers/TermsOfUse';
import Declined from './components/Declined';

export const e2eRoutes = {
  homepage: '/terms-of-use',
  declined: '/terms-of-use/declined',
};

export default {
  path: '/',
  indexRoute: { component: TermsOfUse },
  childRoutes: [
    {
      path: '/declined',
      component: Declined,
    },
  ],
};
