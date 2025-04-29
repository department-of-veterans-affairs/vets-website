import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/contact-information'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
