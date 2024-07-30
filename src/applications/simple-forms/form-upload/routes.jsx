import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import environment from '~/platform/utilities/environment';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-0779'];

const config = formConfig();
const baseUrl = environment.BASE_URL.replace(/3001/g, '3002');
const indexRouteByForm = formId => ({
  onEnter: () => {
    window.location.href = `${baseUrl}/find-forms/about-form-${formId}/`;
  },
});

const routes = formUploadForms.map(formId => {
  return {
    path: `/${formId}`,
    component: App,
    indexRoute: indexRouteByForm(formId),
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
