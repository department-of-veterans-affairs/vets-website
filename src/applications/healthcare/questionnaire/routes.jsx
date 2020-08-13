import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';

const route = {
  path: '/',
  component: QuestionnaireWrapper,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
