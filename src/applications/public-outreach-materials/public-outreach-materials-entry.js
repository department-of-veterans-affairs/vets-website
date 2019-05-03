import '../../platform/polyfills';

import { libraryProcess } from './libraries/library-process';

/**
 * For adding library pages.
 */
export function libraryPages() {
  const outReachMaterials = '/generated/outreach-assets.json';

  libraryProcess(outReachMaterials);
}

document.addEventListener('DOMContentLoaded', libraryPages);
