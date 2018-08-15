import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import ComplaintToolApp from './containers/ComplaintToolApp.jsx';

const route = {
  path: '/',
  component: ComplaintToolApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig)
};

export default route;
