import DischargeWizardApp from './components/DischargeWizardApp';

import HomePage from './components/v2/Homepage';
import ServiceBranch from './components/v2/questions/ServiceBranch';
import DischargeYear from './components/v2/questions/DischargeYear';
import DischargeMonth from './components/v2/questions/DischargeMonth';
import Reason from './components/v2/questions/Reason';
import DischargeType from './components/v2/questions/DischargeType';
import CourtMartial from './components/v2/questions/CourtMartial';
import Intention from './components/v2/questions/Intention';
import PrevApplicationType from './components/v2/questions/PrevApplicationType';
import PrevApplication from './components/v2/questions/PrevApplication';
import PrevApplicationYear from './components/v2/questions/PrevApplicationYear';
import PriorService from './components/v2/questions/PriorService';
import FailureToExhaust from './components/v2/questions/FailureToExhaust';
import ReviewPage from './components/v2/ReviewPage';
import ResultsPage from './components/v2/ResultsPage';
import RequestDD214v2 from './components/v2/RequestDD214';

const envChildRoutes = [
  // new routes for DUW v2
  { path: 'introduction1', component: HomePage },
  { path: 'introduction', component: HomePage },
  { path: 'service-branch', component: ServiceBranch },
  { path: 'discharge-year', component: DischargeYear },
  { path: 'discharge-month', component: DischargeMonth },
  { path: 'reason', component: Reason },
  { path: 'discharge-type', component: DischargeType },
  { path: 'court-martial', component: CourtMartial },
  { path: 'intention', component: Intention },
  { path: 'prev-application-type', component: PrevApplicationType },
  { path: 'prev-application', component: PrevApplication },
  { path: 'prev-application-year', component: PrevApplicationYear },
  { path: 'prior-service', component: PriorService },
  { path: 'failure-to-exhaust', component: FailureToExhaust },
  { path: 'review', component: ReviewPage },
  { path: 'results', component: ResultsPage },
  { path: 'request-dd214-v2', component: RequestDD214v2 },
];
const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: { component: HomePage },
  childRoutes: envChildRoutes,
};

export default routes;
