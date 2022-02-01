import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';
import withFeatureFlip from '../shared/containers/withFeatureFlip';

const component = withFeatureFlip(App, 'update');
const replacementPath = `/update-form${window.location.search}`;

const route = {
  path: '/',
  component,
  indexRoute: {
    onEnter: (() => {
      let hasRedirected = false;
      return (nextState, replace) => {
        if (!hasRedirected) {
          hasRedirected = true;
          replace(replacementPath);
        }
      };
    })(),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};
const introRouteIndex = route.childRoutes.findIndex(
  cr => cr.path === 'introduction',
);
route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
  replace(replacementPath);
};
export default route;
