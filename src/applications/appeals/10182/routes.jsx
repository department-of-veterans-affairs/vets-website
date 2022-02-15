import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import FormApp from './containers/FormApp';

const route = {
  path: '/',
  component: FormApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
