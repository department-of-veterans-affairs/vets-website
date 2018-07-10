import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import OptOutApp from './containers/Form0993App.jsx';
import RoutedSavableSinglePageForm from './containers/RoutedSavableSinglePageForm';

const filteredRoutes = new Set(['introduction', 'review-and-submit']);

const childRoutes = createRoutesWithSaveInProgress(formConfig).filter(route => !filteredRoutes.has(route.path));


// Set single page form component
childRoutes[0].component = RoutedSavableSinglePageForm;

// Provision form config
childRoutes[0].formConfig = formConfig;

const route = {
  path: '/',
  component: OptOutApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/applicant/information') },
  childRoutes
};

export default route;
