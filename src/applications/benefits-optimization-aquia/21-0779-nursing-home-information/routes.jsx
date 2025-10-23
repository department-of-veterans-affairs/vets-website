import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config/form';
import { App } from '@bio-aquia/21-0779-nursing-home-information/containers/app';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
