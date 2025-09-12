import manifest from './manifest.json';
import startFormEngineApp from '../shared/utils/startApp';

startFormEngineApp({
  formId: 'FORM_123_123',
  rootUrl: manifest.rootUrl,
  trackingPrefix: 'form-new-app-form-engine-',
  breadcrumbs: [
    { href: '/', label: 'VA.gov home' },
    {
      href: '/form-new-app-form-engine',
      label: 'Form New App Form Engine',
    },
  ],
});
