import widgetTypes from 'platform/site-wide/widgetTypes';
import createHomepageSearch from './createHomepageSearch';
import { GLOBAL_STORE_VARIABLE_NAME } from '../static-pages-essentials/constants';

// Redux store exposed by static-pages-essentials bundle
const store = window[GLOBAL_STORE_VARIABLE_NAME];
if (!store) {
  throw new Error(
    'Redux store not found for homepage bundle. Please load the static-pages-essentials bundle first.',
  );
}

createHomepageSearch(store, widgetTypes.HOMEPAGE_SEARCH);
