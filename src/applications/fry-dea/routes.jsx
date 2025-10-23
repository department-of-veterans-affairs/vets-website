import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import FryDeaApp from './containers/FryDeaApp';

const route = {
  childRoutes: createRoutesWithSaveInProgress(formConfig),
  component: FryDeaApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  path: '/',
};

export default route;
