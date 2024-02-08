// import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
// import formConfig from './config/form';
// import App from './containers/App.jsx';
import TravelPayStatusApp from './containers/TravelPayStatusApp.jsx';

const route = {
  path: '/',
  // component: App,
  component: TravelPayStatusApp,
  // indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  // childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
