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
];
const config = formConfig();

/**
 * the exclude-paths dataset must be updated for a particular form or the minimal header will not render
 * due to dynamic routes updating the path on a per form basis
 */
function updateExcludePaths(formconf) {
  const { formId } = formconf;
  const formNumber = formId.replace('-UPLOAD', '');
  const minimalHeader = document.getElementById('header-minimal');
  if (minimalHeader) {
    const excludePaths = JSON.parse(minimalHeader.dataset.excludePaths);
    if (Array.isArray(excludePaths)) {
      const _excludePaths = excludePaths.map(path => `/${formNumber}${path}`);
      minimalHeader.dataset.excludePaths = JSON.stringify(_excludePaths);
    }
  }
}

updateExcludePaths(config);

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
