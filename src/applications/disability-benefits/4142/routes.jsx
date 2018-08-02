import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import Form4142App from './containers/Form4142App';

const route = {
  path: '/',
  component: Form4142App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig)
};

export default route;
