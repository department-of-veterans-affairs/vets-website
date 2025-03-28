import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = [
  '21-0779',
  '21-4192',
  '21-509',
  '21-8940',
  '21P-0516-1',
  '21P-0518-1',
  '21P-530a',
  '21P-8049',
];

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
