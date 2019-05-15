import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import Form1995StemEntry from './Form1995StemApp.jsx';

const route = [
  {
    path: '/',
    component: Form1995StemEntry,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default route;
