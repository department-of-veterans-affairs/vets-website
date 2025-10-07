import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
// import MedicalExpenseReportApp from './containers/MedicalExpenseReportApp';
import { App } from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
