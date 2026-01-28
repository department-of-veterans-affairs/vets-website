import widgetTypes from 'platform/site-wide/widgetTypes';
import createHomepageSearch from './createHomepageSearch';
import { getGlobalStore } from '../static-pages-essentials/store';

// Redux store exposed by static-pages-essentials bundle
const store = getGlobalStore();

createHomepageSearch(store, widgetTypes.HOMEPAGE_SEARCH);
