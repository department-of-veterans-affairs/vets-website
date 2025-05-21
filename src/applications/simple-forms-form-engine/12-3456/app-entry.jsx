import manifest from './manifest.json';
import startFormEngineApp from '../shared/utils/startApp';

startFormEngineApp({
  formId: '12-3456',
  rootUrl: manifest.rootUrl,
  trackingPrefix: '12-3456-',
  breadcrumbs: [
    { href: '/', label: 'VA.gov home' },
    {
      href: '/form-builder-sandbox-12-3456',
      label: '12-3456 Form Builder Sandbox',
    },
  ],
});
