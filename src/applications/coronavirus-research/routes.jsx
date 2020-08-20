import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

// let hasRedirected = false;

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/volunteer'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};
const introRouteIndex = route.childRoutes.findIndex(
  cr => cr.path === 'introduction',
);
// console.log(route.childRoutes);

route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
  // console.log('has redirected: ', hasRedirected);
  // console.log('next state: ', nextState);
  // if (!hasRedirected) {
  // hasRedirected = true;
  // console.log('On Enter called ...');
  replace('/volunteer');
  // }
};
// route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
//   console.log('has redirected: ', hasRedirected);
//   if (!hasRedirected) {
//     hasRedirected = true;
//     console.log('On Enter called ...');
//     replace('/coronavirus-research/volunteer');
//   }
// };
export default route;
