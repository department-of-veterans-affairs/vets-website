import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config';
import { App } from '@bio-aquia/21-0779-nursing-home-information/containers/app';

export const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};
