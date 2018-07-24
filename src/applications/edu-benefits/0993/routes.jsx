import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import Form0993App from './Form0993App';
import RoutedSavableSinglePageForm from './containers/RoutedSavableSinglePageForm';

const filteredRoutes = new Set(['introduction']);

const childRoutes = createRoutesWithSaveInProgress(formConfig).filter(route => !filteredRoutes.has(route.path));

const route = {
  path: '/',
  component: Form0993App,
  indexRoute: { onEnter: (nextState, replace) => replace('/claimant-information') },
  childRoutes
};

export default route;
