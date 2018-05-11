import { addSaveInProgressRoutes } from '../common/schemaform/save-in-progress/helpers';

import formConfig from './config/form';
import VeteranIDCardApp from './VeteranIDCardApp';

const route = {
  path: '/',
  component: VeteranIDCardApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: addSaveInProgressRoutes(formConfig),
};

export default route;
