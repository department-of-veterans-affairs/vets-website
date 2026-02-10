import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },

  childRoutes: createRoutesWithSaveInProgress({}),
};

export default route;
