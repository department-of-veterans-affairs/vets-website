import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';

import { addSaveInProgressRoutes } from '../common/schemaform/save-in-progress/helpers';

import formConfig from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: addSaveInProgressRoutes(formConfig, createFormRoutes(formConfig)),
};

export default route;
