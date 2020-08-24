import 'platform/polyfills';
import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';

const store = createCommonStore();

startSitewideComponents(store);

document.addEventListener('DOMContentLoaded', () => {
  // check the auth cookie
  // if none is found, early exit and do nothing
  alert('hey')
});
