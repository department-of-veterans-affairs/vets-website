import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { removeTrailingSlash } from './utils/string';

export const getRoutesFromFormConfig = formConfig => {
  const childRoutes = createRoutesWithSaveInProgress(formConfig);
  const urlPrefix = removeTrailingSlash(formConfig.urlPrefix);

  return {
    path: `${urlPrefix}(/)`,
    component: ({ location, children }) => (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    ),
    indexRoute: {
      onEnter: (nextState, replace) => {
        return replace(`${urlPrefix}/introduction`);
      },
    },
    childRoutes,
  };
};
