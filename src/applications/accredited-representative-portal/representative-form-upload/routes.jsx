import formConfig from './config/form';

// Add any new form-upload forms to this list
const formUploadForms = [
  '21-0779',
  '21-509',
  '21P-0518-1',
  '21P-0516-1',
  '21-686c',
];

const config = formConfig;

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import App from './containers/App';

const routes = formUploadForms.map(formId => {
  return {
    path: `/${formId}`,
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace(`/${formId}/introduction`),
    },
    childRoutes: createRoutesWithSaveInProgress(config),
  };
});

export default routes;
