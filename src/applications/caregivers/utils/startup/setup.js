import * as Sentry from '@sentry/browser';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import startSitewideComponents from 'platform/site-wide';
import createRtkStore from './store';

const setUpRtkFunctionality = async props => {
  const { analyticsEvents, entryName, reducer, url } = props;

  // set further errors to have the appropriate source tag
  Sentry.setTag('source', entryName);

  // set app name for use in the `apiRequest` helper
  window.appName = entryName;

  const store = await createRtkStore({ analyticsEvents, appReducer: reducer });
  await connectFeatureToggle(store.dispatch);

  if (url?.endsWith('/')) {
    throw new Error(
      'Root URLs should not end with a slash. Check your manifest.json file and application entry file.',
    );
  }

  Sentry.withScope(scope => {
    scope.setTag('source', 'site-wide');
    startSitewideComponents(store);
  });

  return store;
};

export default setUpRtkFunctionality;
