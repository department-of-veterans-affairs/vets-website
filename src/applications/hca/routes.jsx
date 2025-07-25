import { createV5RoutesFromLegacy } from 'platform/forms-system/src/js/routing/convertLegacyRoutes';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

const legacyRoutes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

const routes = createV5RoutesFromLegacy(legacyRoutes);

export default routes;
