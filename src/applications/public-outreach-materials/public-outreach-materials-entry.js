import '../../platform/polyfills';
import './sass/public-outreach-materials.scss';
import '../static-pages/sidebar-navigation.js';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import { libraryProcess } from './libraries/library-process';

/**
 * For adding library pages.
 */
export function libraryPages() {
  const outReachMaterials = '/generated/outreach-assets.json';

  libraryProcess(outReachMaterials);
}

const store = createCommonStore();

startSitewideComponents(store);

document.addEventListener('DOMContentLoaded', libraryPages);
