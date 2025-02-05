import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

export const getRoutesFromFormConfig = formConfig => {
  const childRoutes = createRoutesWithSaveInProgress(formConfig);

  return {
    path: `/`,
    component: ({ location, children }) => (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    ),
    indexRoute: {
      onEnter: (nextState, replace) => {
        return replace(`/introduction`);
      },
    },
    childRoutes,
  };
};
