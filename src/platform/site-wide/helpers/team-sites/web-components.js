import { getAssetPath } from '~/platform/site-wide/helpers/team-sites/get-asset-path';
import { getTargetEnv } from '~/platform/site-wide/helpers/team-sites/get-target-env';

/*
 * This file is intended to support legacy pages.
 * Consider deprecating this file once all legacy pages have been modernized.
 */

/**
 * Installs our custom web-components library if it does not yet exist.
 * It only checks within the document HEAD for the library & will be appended to there.
 * @todo This could be refactored to take any JS or CSS resource name as a param, & then
 *    depending on the file suffix (file type ['.js'|'.css']), dynamically create the
 *    appropriate tag/element & load it into the `<head />`. We may want to do this so
 *    this function is more reusable by not being web-components-specific.
 */
export const installWebComponentsLibrary = () => {
  const assetPath = getAssetPath(getTargetEnv());
  const head = document.querySelector('head');
  // Using a `DocumentFragment` to avoid any unnecessary repaints.
  const fragment = document.createDocumentFragment();
  // `wc` = web-components
  const wcScriptSrc = `${assetPath}/generated/web-components.entry.js`;
  const wcLinkHref = `${assetPath}/generated/web-components.css`;
  // Query for any existing web-component resources.
  let wcScript = head.querySelector(`script[src="${wcScriptSrc}"]`);
  let wcLink = head.querySelector(`link[href="${wcLinkHref}"]`);

  if (!wcScript) {
    // Load our custom component library.
    wcScript = document.createElement('script');

    wcScript.src = wcScriptSrc;
    wcScript.type = 'text/javascript';

    fragment.appendChild(wcScript);
  }

  if (!wcLink) {
    // Load our custom stylesheet.
    wcLink = document.createElement('link');

    wcLink.href = wcLinkHref;
    wcLink.rel = 'stylesheet';

    fragment.appendChild(wcLink);
  }

  // Append the fragment contents to the document head.
  head.appendChild(fragment);
};
