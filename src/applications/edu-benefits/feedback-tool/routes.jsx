import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import FeedbackToolApp from './containers/FeedbackToolApp';

const route = {
  path: '/',
  component: FeedbackToolApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
