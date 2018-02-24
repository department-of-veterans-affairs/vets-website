import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import VeteranIDCardApp from './VeteranIDCardApp';

const route = {
  path: '/',
  component: VeteranIDCardApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;
