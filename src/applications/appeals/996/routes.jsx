import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { createRouteRedirectComponent } from 'platform/forms-system/src/js/routing/migration-helpers';

import Form0996App from './containers/Form0996App';
import formConfig from './config/form';

// Convert onEnter function to v5 component pattern
const IndexRedirectComponent = createRouteRedirectComponent('/introduction');

const routes = [
  {
    path: '/',
    component: Form0996App,
    indexRoute: { component: IndexRedirectComponent },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
