import App from './containers/App';
import IntroductionPage from './containers/IntroductionPage';
import { ROUTES } from './constants';
import QuestionTemplate from './containers/QuestionTemplate';

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace(`/${ROUTES.INTRODUCTION}`),
    component: IntroductionPage,
  },
  childRoutes: [
    { path: ROUTES.INTRODUCTION, component: IntroductionPage },
    { path: ROUTES.Q_1_1_CLAIM_DECISION, component: QuestionTemplate },
    { path: ROUTES.Q_1_1A_SUBMITTED_526, component: QuestionTemplate },
    { path: ROUTES.Q_1_2_CLAIM_DECISION, component: QuestionTemplate },
    { path: ROUTES.Q_1_2A_CONDITION_WORSENED, component: QuestionTemplate },
    { path: ROUTES.Q_1_2B_LAW_POLICY_CHANGE, component: QuestionTemplate },
    { path: ROUTES.Q_1_2C_NEW_EVIDENCE, component: QuestionTemplate },
    { path: ROUTES.Q_1_3_CLAIM_CONTESTED, component: QuestionTemplate },
    { path: ROUTES.Q_1_3A_FEWER_60_DAYS, component: QuestionTemplate },
    { path: ROUTES.Q_2_0_CLAIM_TYPE, component: QuestionTemplate },
    { path: ROUTES.Q_2_IS_1_SERVICE_CONNECTED, component: QuestionTemplate },
    { path: ROUTES.Q_2_IS_1A_LAW_POLICY_CHANGE, component: QuestionTemplate },
    { path: ROUTES.Q_2_IS_1B_NEW_EVIDENCE, component: QuestionTemplate },
    { path: ROUTES.Q_2_IS_2_CONDITION_WORSENED, component: QuestionTemplate },
    { path: ROUTES.Q_2_S_1_NEW_EVIDENCE, component: QuestionTemplate },
    { path: ROUTES.Q_2_H_1_EXISTING_BOARD_APPEAL, component: QuestionTemplate },
    { path: ROUTES.Q_2_H_2_NEW_EVIDENCE, component: QuestionTemplate },
    { path: ROUTES.Q_2_H_2A_JUDGE_HEARING, component: QuestionTemplate },
    { path: ROUTES.Q_2_H_2B_JUDGE_HEARING, component: QuestionTemplate },
  ],
};

export default routes;
