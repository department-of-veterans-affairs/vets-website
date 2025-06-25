import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { CodespaceRouteHoc } from 'platform/codespaces';
import { tabsConfig } from 'platform/codespaces/tabs';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';
import App from './containers/App.jsx';

const updatedTabConfig = [
  {
    ...tabsConfig[0],
    name: 'Service History',
    path: '/service-history',
    description: 'Service History',
  },
  {
    ...tabsConfig[1],
    name: 'Expand Under',
    path: '/expand-under',
    description: 'Expand Under',
  },
];

const route = {
  path: '/',
  component: CodespaceRouteHoc({
    Component: App,
    featureToggleName: TOGGLE_NAMES.aedpVADX,
    tabsConfig: updatedTabConfig,
  }),
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
