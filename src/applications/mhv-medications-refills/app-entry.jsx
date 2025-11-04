import 'platform/polyfills';
import './sass/medications-refills.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';

import startReactApp from 'platform/startup/react';

import router from './routes';
import { store } from './store';

/**
 * App component
 * Wraps RouterProvider with Redux Provider to ensure Redux context is available
 * to all route components and hooks (including RTK Query)
 */
const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// Start the application normally
// The skeleton HTML will be replaced when React renders
// Note: We don't use hydration because the skeleton is not a React-rendered component
// but a static placeholder for perceived performance
startReactApp(<App />);

// Export the store to make it accessible elsewhere in the app
export { store };
