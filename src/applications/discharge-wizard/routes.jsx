import DischargeWizardApp from './components/DischargeWizardApp';

import HomePage from './components/Homepage';
import ServiceBranch from './components/questions/ServiceBranch';
import DischargeYear from './components/questions/DischargeYear';
import DischargeMonth from './components/questions/DischargeMonth';
import Reason from './components/questions/Reason';
import DischargeType from './components/questions/DischargeType';
import CourtMartial from './components/questions/CourtMartial';
import Intention from './components/questions/Intention';
import PrevApplicationType from './components/questions/PrevApplicationType';
import PrevApplication from './components/questions/PrevApplication';
import PrevApplicationYear from './components/questions/PrevApplicationYear';
import PriorService from './components/questions/PriorService';
import FailureToExhaust from './components/questions/FailureToExhaust';
import ReviewPage from './components/ReviewPage';
import ResultsPage from './components/ResultsPage';
import RequestDD214 from './components/RequestDD214';

const envChildRoutes = [
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
  { path: 'request-dd214', component: RequestDD214 },
];
const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: envChildRoutes,
};

export default routes;
