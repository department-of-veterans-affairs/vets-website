import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import MedicalExpenseReportApp from './containers/MedicalExpenseReportApp';

const route = {
  path: '/',
  component: MedicalExpenseReportApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
