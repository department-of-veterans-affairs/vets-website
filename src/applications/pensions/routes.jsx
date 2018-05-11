import { addSaveInProgressRoutes } from '../common/schemaform/save-in-progress/helpers';

import formConfig from './config/form';
import PensionsApp from './PensionsApp.jsx';

const routes = [
  {
    path: '/',
    component: PensionsApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: addSaveInProgressRoutes(formConfig),
  }
];

export default routes;
