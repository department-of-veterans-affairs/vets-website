import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';

import App from '../../containers/App';
import formConfig from './config/form';

const routes = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default routes;
