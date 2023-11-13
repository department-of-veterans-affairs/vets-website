import TermsOfUse from './containers/TermsOfUse';
import Declined from './components/Declined';
import MyVAHealth from './components/MyVAHealth';

export const e2eRoutes = {
  homepage: '/terms-of-use',
  declined: '/terms-of-use/declined',
  myvahealth: '/terms-of-use/myvahealth',
};

export default {
  path: '/',
  indexRoute: { component: TermsOfUse },
  childRoutes: [
    {
      path: '/declined',
      component: Declined,
    },
    {
      path: '/myvahealth',
      component: MyVAHealth,
    },
  ],
};
