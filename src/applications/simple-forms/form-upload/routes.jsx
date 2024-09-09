import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-0779'];

const config = formConfig();

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

// or dynamic
// {
//   path: '/:formId',
//   component: App,
//   indexRoute: indexRouteByForm(':formId'),
//   childRoutes: createRoutesWithSaveInProgress(config),
// },

export default routes;
