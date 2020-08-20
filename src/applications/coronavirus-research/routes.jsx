import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

// let hasRedirected = false;

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/sign-up'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};
const introRouteIndex = route.childRoutes.findIndex(
  cr => cr.path === 'introduction',
);

route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
  replace('/sign-up');
};
// route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
//   console.log('has redirected: ', hasRedirected);
//   if (!hasRedirected) {
//     hasRedirected = true;
//     console.log('On Enter called ...');
//     replace('/sign-up');
//   }
// };
export default route;
