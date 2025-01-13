import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import App from './containers/App';
import formConfig from './config/form';

const form21aRoutes = {
  path: formConfig.urlPrefix,
  childRoutes: createRoutesWithSaveInProgress(formConfig),
  indexRoute: {
    onEnter: (_, replace) => replace(`${formConfig.urlPrefix}introduction`),
  },
  component: ({ location, children }) => (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ),
};

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (_, replace) => replace(`${form21aRoutes.path}introduction`),
  },
  childRoutes: [form21aRoutes],
};

form21aRoutes.component.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default routes;
