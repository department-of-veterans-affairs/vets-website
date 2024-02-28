import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';
import formConfig from './config/form';
import Form0993App from './Form0993App';
import RoutedSavableFormPage from './containers/RoutedSavableFormPage';

const filteredRoutes = new Set(['introduction']);

const childRoutes = createRoutesWithSaveInProgress(formConfig).filter(
  route => !filteredRoutes.has(route.path),
);

// Set form page component with custom back behavior
childRoutes[0].component = RoutedSavableFormPage;

const routes = [
  {
    path: '/introduction',
    onEnter: (nextState, replace) =>
      replace(formConfig.urlPrefix || '/claimant-information'),
  },
  {
    path: '/',
    component: Form0993App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/claimant-information'),
    },
    childRoutes,
  },
];

export default routes;
