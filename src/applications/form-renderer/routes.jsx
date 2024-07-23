import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import App from './containers/App';
import { removeTrailingSlash } from './utils/string';

export const getRoutesFromFormConfig = formConfig => {
  const childRoutes = createRoutesWithSaveInProgress(formConfig);
  const urlPrefix = removeTrailingSlash(formConfig.urlPrefix);

  return {
    path: `${urlPrefix}(/)`,
    component: ({ location, children }) => (
      <App formConfig={formConfig} location={location}>
        {children}
      </App>
    ),
    indexRoute: {
      onEnter: (nextState, replace) => {
        return replace(`${urlPrefix}/introduction`);
      },
    },
    childRoutes,
  };
};
