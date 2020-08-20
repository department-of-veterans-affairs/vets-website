import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  indexRoute: {
    // onEnter: (nextState, replace) => replace('/sign-up'),
    onEnter: (() => {
      let hasRedirected = false;
      return (nextState, replace) => {
        if (!hasRedirected) {
          hasRedirected = true;
          replace('/sign-up');
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
  replace('/sign-up');
};
export default route;
