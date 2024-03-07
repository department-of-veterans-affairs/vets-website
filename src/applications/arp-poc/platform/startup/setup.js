import createCommonStore from './store';
import startSitewideComponents from '../site-wide';

export default function setUpCommonFunctionality({ entryName, reducer }) {
  // Set the app name for use in the apiRequest helper
  window.appName = entryName;

  const store = createCommonStore(reducer);
  startSitewideComponents(store);

  return store;
}
