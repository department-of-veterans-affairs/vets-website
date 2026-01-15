import widgetTypes from 'platform/site-wide/widgetTypes';
import createHomepageSearch from './createHomepageSearch';
import { GLOBAL_STORE_VARIABLE_NAME } from '../sitewide-minimal/constants';

// Redux store exposed by sitewide-minimal bundle
const store = window[GLOBAL_STORE_VARIABLE_NAME];

if (store) {
  createHomepageSearch(store, widgetTypes.HOMEPAGE_SEARCH);
} else {
  throw new Error('Redux store not found for homepage bundle');
}
