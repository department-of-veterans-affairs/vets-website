// duplicated vat name: startApp, in platform, adjusted to startAppFromIndex
import startAppFromIndex from './index'; // used outside platform

// duplicated vat name: startApp, in platform, adjusted to startAppFromRouter
import startAppFromRouter from './router'; // used outside platform

import createCommonStore from './store'; // used outside platform

// tentative
import createAnalyticsMiddleware from './analytics-middleware';
import startReactApp from './react';
import setUpCommonFunctionality from './setup';

export {
  startAppFromIndex,
  startAppFromRouter,
  createCommonStore,
  createAnalyticsMiddleware,
  startReactApp,
  setUpCommonFunctionality,
};
