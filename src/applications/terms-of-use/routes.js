import TermsOfUse from './containers/TermsOfUse';
import Declined from './components/Declined';

export default [
  {
    path: '/',
    component: TermsOfUse,
  },
  {
    path: '/declined',
    component: Declined,
  },
];
