import { libraryProcess } from './library-process';
/**
 * For adding library pages.
 */
export function libraryPages() {
  const outReachMaterials = `https://raw.githubusercontent.com/ethanteague/va-assets-array/master/media-assets.json`;
  const path = window.location.pathname.split('/');

  if (path.includes('public-outreach-materials')) {
    libraryProcess(outReachMaterials);
  }
}

document.addEventListener('DOMContentLoaded', libraryPages);
