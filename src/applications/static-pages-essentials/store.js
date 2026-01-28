/**
 * This module contains helper functions to expose the global Redux store to other
 * bundles on the window object and access it in other bundles. This allows us to split
 * the static-pages bundle into the static-pages-essentials bundle and ones that are
 * specific to a particular page type but rely on the same Redux store.
 */

const GLOBAL_STORE_VARIABLE_NAME = '__globalSitewideStore';

export function setGlobalStore(store) {
  window[GLOBAL_STORE_VARIABLE_NAME] = store;
}

export function getGlobalStore() {
  const store = window[GLOBAL_STORE_VARIABLE_NAME];
  if (!store) {
    throw new Error(
      'Redux store not found on the global window object. Please load the static-pages-essentials bundle first.',
    );
  }
  return store;
}
