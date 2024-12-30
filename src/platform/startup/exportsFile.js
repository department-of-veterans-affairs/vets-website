// duplicated vat name: startApp, in platform, adjusted to startAppFromIndex
export { default as startAppFromIndex } from './index'; // used outside platform

// duplicated vat name: startApp, in platform, adjusted to startAppFromRouter
export { default as startAppFromRouter } from './router'; // used outside platform

export { createCommonStore } from './store'; // used outside platform

// tentative
export { default as createAnalyticsMiddleware } from './analytics-middleware';
export { startReactApp } from './react';
export { setUpCommonFunctionality } from './setup';
