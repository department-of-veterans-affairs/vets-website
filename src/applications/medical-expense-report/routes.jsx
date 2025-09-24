import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import MedicalExpenseReportApp from './MedicalExpenseReportApp';

const routes = [
  {
    path: '/',
    component: MedicalExpenseReportApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
