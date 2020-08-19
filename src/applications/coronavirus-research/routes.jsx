import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  // indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  indexRoute: {
    onEnter: (nextState, replace) => replace('/coronavirus-research/volunteer'),
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};
const introRouteIndex = route.childRoutes.findIndex(
  cr => cr.path === 'introduction',
);
route.childRoutes[introRouteIndex].onEnter = (nextState, replace) =>
  replace('/coronavirus-research/volunteer');

export default route;
