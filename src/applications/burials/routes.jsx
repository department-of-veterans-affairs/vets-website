import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import { addSaveInProgressRoutes } from '../common/schemaform/save-in-progress/helpers';

import formConfig from './config/form';
import BurialsApp from './BurialsApp.jsx';

const route = {
  path: '/',
  component: BurialsApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: addSaveInProgressRoutes(formConfig, createFormRoutes(formConfig)),
};

export default route;
