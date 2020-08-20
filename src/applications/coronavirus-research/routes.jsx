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

// console.log('route: ', route);
// console.log(route.childRoutes);
// route.childRoutes[volunteerRouteIndex].onEnter = (nextState, replace) => {
//   console.log('Volunteer OnEnter() ', nextState);
//   // replace('/volunteer');
// };
route.childRoutes[introRouteIndex].onEnter = (nextState, replace) => {
  // console.log('introduction onEnter: ', nextState);
  // console.log('next state: ', nextState);
  // if (!hasRedirected) {
  // hasRedirected = true;
  // console.log('On Enter called ...');
  replace('/sign-up');
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
