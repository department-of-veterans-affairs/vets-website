import environment from 'platform/utilities/environment';

import DischargeWizardApp from './components/DischargeWizardApp';
import GuidancePage from './containers/GuidancePage';
import FormPage from './containers/FormPage';
import InstructionsPage from './components/InstructionsPage';
import RequestDD214 from './containers/RequestDD214';

import HomePage from './components/v2/Homepage';

const envChildRoutes = environment.isProduction()
  ? [
      { path: 'questions', component: FormPage },
      { path: 'guidance', component: GuidancePage },
      { path: 'request-dd214', component: RequestDD214 },
    ]
  : [
      { path: 'questions', component: FormPage },
      { path: 'guidance', component: GuidancePage },
      { path: 'request-dd214', component: RequestDD214 },
      // new routes for DUW v2
      { path: 'introduction', component: HomePage },
    ];
const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: { component: InstructionsPage },
  childRoutes: envChildRoutes,
};

export default routes;
