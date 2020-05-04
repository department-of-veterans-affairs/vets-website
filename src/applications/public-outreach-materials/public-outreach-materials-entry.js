import 'platform/polyfills';
import './sass/public-outreach-materials.scss';

import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';

import { libraryListeners } from './libraries/library-filters';

const store = createCommonStore();

startSitewideComponents(store);

document.addEventListener('DOMContentLoaded', libraryListeners);
