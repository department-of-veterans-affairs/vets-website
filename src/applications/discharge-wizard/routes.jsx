import environment from 'platform/utilities/environment';

import DischargeWizardApp from './components/DischargeWizardApp';
import GuidancePage from './containers/GuidancePage';
import FormPage from './containers/FormPage';
import InstructionsPage from './components/InstructionsPage';
import RequestDD214 from './containers/RequestDD214';

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
    ];
const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: { component: InstructionsPage },
  childRoutes: envChildRoutes,
};

export default routes;
