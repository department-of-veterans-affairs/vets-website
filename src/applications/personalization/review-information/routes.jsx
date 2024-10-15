import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import { PatternConfigProvider } from './context/PatternConfigContext';

const route = {
  path: '/',
  component: props => (
    <PatternConfigProvider {...props}>
      <App {...props} />
    </PatternConfigProvider>
  ),
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
