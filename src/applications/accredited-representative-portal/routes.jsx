import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from './accreditation/21a/config/form';
import App from './accreditation/21a/containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
