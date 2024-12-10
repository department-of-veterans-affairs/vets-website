import '@department-of-veterans-affairs/platform-polyfills';

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import './sass/accredited-representative-portal.scss';
import './sass/POARequestsCard.scss';
import './sass/POARequestDetails.scss';

import manifest from './manifest.json';
import router from './routes';
import createReduxStore from './store';
import rootReducer from './reducers';

window.appName = manifest.entryName;
const store = createReduxStore(rootReducer);
connectFeatureToggle(store.dispatch);

startReactApp(
  <Provider store={store}>
    <Suspense fallback={<VaLoadingIndicator message="Loading..." />}>
      <RouterProvider router={router} />
    </Suspense>
  </Provider>,
);
