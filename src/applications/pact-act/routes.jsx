import HomePage from './containers/HomePage';
import ServicePeriod from './containers/questions/ServicePeriod';
import BurnPit21 from './containers/questions/burn-pit/BurnPit-2-1';
import BurnPit211 from './containers/questions/burn-pit/BurnPit-2-1-1';
import BurnPit212 from './containers/questions/burn-pit/BurnPit-2-1-2';
import AgentOrange221A from './containers/questions/agent-orange/AgentOrange-2-2-1-A';
import AgentOrange221B from './containers/questions/agent-orange/AgentOrange-2-2-1-B';
import AgentOrange222 from './containers/questions/agent-orange/AgentOrange-2-2-2';
import AgentOrange223 from './containers/questions/agent-orange/AgentOrange-2-2-3';
import AgentOrange22A from './containers/questions/agent-orange/AgentOrange-2-2-A';
import AgentOrange22B from './containers/questions/agent-orange/AgentOrange-2-2-B';
import Radiation23A from './containers/questions/radiation/Radiation-2-3-A';
import Radiation23B from './containers/questions/radiation/Radiation-2-3-B';
import CampLejeune24 from './containers/questions/camp-lejeune/Lejeune-2-4';
import PACTActApp from './components/PACTActApp';
import Results1Page1 from './containers/results/Results1-1';
import Results1Page2 from './containers/results/Results1-2';
import Results2 from './containers/results/Results2';
import Results3 from './containers/results/Results3';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: PACTActApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace(`/${ROUTES.HOME}`),
    component: Results1Page1,
  },
  childRoutes: [
    { path: ROUTES.HOME, component: HomePage },
    { path: ROUTES.SERVICE_PERIOD, component: ServicePeriod },
    { path: ROUTES.BURN_PIT_2_1, component: BurnPit21 },
    { path: ROUTES.BURN_PIT_2_1_1, component: BurnPit211 },
    { path: ROUTES.BURN_PIT_2_1_2, component: BurnPit212 },
    { path: ROUTES.ORANGE_2_2_A, component: AgentOrange22A },
    { path: ROUTES.ORANGE_2_2_B, component: AgentOrange22B },
    { path: ROUTES.ORANGE_2_2_1_A, component: AgentOrange221A },
    { path: ROUTES.ORANGE_2_2_1_B, component: AgentOrange221B },
    { path: ROUTES.ORANGE_2_2_2, component: AgentOrange222 },
    { path: ROUTES.ORANGE_2_2_3, component: AgentOrange223 },
    { path: ROUTES.RADIATION_2_3_A, component: Radiation23A },
    { path: ROUTES.RADIATION_2_3_B, component: Radiation23B },
    { path: ROUTES.LEJEUNE_2_4, component: CampLejeune24 },
    { path: ROUTES.RESULTS_1_1, component: Results1Page1 },
    { path: ROUTES.RESULTS_1_2, component: Results1Page2 },
    { path: ROUTES.RESULTS_2, component: Results2 },
    { path: ROUTES.RESULTS_3, component: Results3 },
  ],
};

export default routes;
