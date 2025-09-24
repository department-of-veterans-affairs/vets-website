import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import SurvivorsBenefitsApp from './containers/SurvivorsBenefitsApp';

const route = {
  path: '/',
  component: SurvivorsBenefitsApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
