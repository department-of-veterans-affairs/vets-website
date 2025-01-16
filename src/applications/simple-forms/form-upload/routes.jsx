import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import { buildManifest } from './manifest-helpers';

// Add any new form-upload forms to this list
const formUploadForms = ['21-0779', '21-509'];

const config = formConfig();

const routes = formUploadForms.map(formNumber => {
  const baseUrl = buildManifest(formNumber).rootUrl;
  return {
    path: baseUrl,
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace(`${baseUrl}/introduction`),
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
