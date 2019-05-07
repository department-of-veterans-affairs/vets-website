import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import Form1995TechEntry from './Form1995TechApp.jsx';

const route = [
  {
    path: '/',
    component: Form1995TechEntry,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default route;
