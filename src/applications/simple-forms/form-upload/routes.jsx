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
  '21P-0517-1',
  '21P-0518-1',
  '21P-0519C-1',
  '21P-0519S-1',
  '21P-530a',
  '21P-8049',
  '21-2680',
  '21-674b',
  '21-8951-2',
  '21-0788',
  '21-4193',
  '21P-4718a',
  '21-4140',
  '21P-4706c',
  '21-8960',
  '21-0304',
  '21-651',
  '21P-4185',
  '21P-535',
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

routes.push({
  path: '/',
  onEnter: () => {
    if (!window.Cypress) {
      window.location.replace('/forms');
    }
  },
});
// or dynamic
// {
//   path: '/:formId',
//   component: App,
//   indexRoute: indexRouteByForm(':formId'),
//   childRoutes: createRoutesWithSaveInProgress(config),
// },

export default routes;
