import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import { formConfigV2 } from './config/form';
import BurialsApp from './BurialsApp.jsx';

const route = {
  path: '/',
  component: BurialsApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfigV2),
};

export default route;
