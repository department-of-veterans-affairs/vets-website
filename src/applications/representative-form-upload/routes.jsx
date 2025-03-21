import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-686c'];

const config = formConfig();

const routes = formUploadForms.map(formId => {
  const lowerCaseFormId = formId.toLowerCase();
  return {
    path: `/${lowerCaseFormId}`,
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace(`/${lowerCaseFormId}/introduction`),
    },
    childRoutes: createRoutesWithSaveInProgress(config),
  };
});

// or dynamic
// {
//   path: '/:formId',
//   component: App,
//   indexRoute: indexRouteByForm(':formId'),
//   childRoutes: createRoutesWithSaveInProgress(config),
// },

export default routes;
