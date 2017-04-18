import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import reducer from './reducer';
import formConfig from './config/form';
import HealthCareApp from './HealthCareApp.jsx';

export default function createRoutes(store) {
  const onEnter = (r) => () => {
    store.replaceReducer(r);
  };

  return {
    path: '/',
    onEnter: onEnter(reducer),
    component: HealthCareApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  };
}
