import DischargeWizardApp from './containers/DischargeWizardApp';
import GuidancePage from './containers/GuidancePage';

const routes = [
  { path: '/', component: DischargeWizardApp },
  { path: '/guidance', component: GuidancePage }
];

export default routes;
