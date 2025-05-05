import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { originalFormConfig, newFormConfig } from './config/form';
import App from './containers/App.jsx';

const createRoutes = store => {
  const state = store.getState();
  const featureFlagEnabled = toggleValues(state)?.showMeb54901990eTextUpdate;

  const formConfigToUse = featureFlagEnabled
    ? newFormConfig
    : originalFormConfig;

  return {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfigToUse),
  };
};

export default createRoutes;
