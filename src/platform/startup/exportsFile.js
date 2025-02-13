// duplicated vat name: startApp, in platform, adjusted to startAppFromIndex
export { default as startAppFromIndex } from './index'; // used outside platform

// duplicated vat name: startApp, in platform, adjusted to startAppFromRouter
export { default as startAppFromRouter } from './router'; // used outside platform
// React Router V6
export { default as startAppWithoutRouter } from './withoutRouter'; // used outside platform

export { default as createCommonStore } from './store'; // used outside platform

export { authenticatedLoader } from './authenticatedLoader'; // used outside platform

// tentative
export { default as createAnalyticsMiddleware } from './analytics-middleware';
export { default as startReactApp } from './react';
export { default as setUpCommonFunctionality } from './setup';
