import { libraryProcess } from './library-process';
import * as Bucket from '../../../../src/site/constants/buckets';
import * as Environment from '../../../../src/platform/utilities/environment';
/**
 * For adding library pages.
 */
export function libraryPages() {
  const outReachMaterials =
    Environment.default.BUILDTYPE === 'vagovprod'
      ? `${Bucket.vagovprod}/generated/outreach-assets.json`
      : `${Bucket.vagovstaging}/generated/outreach-assets.json`;

  const path = window.location.pathname.split('/');

  if (path.includes('public-outreach-materials')) {
    libraryProcess(outReachMaterials);
  }
}

document.addEventListener('DOMContentLoaded', libraryPages);
