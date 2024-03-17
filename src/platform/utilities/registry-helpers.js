/**
 * Gets the root URL of an app from the registry in the content-build.
 *
 * @param {string} entryName - An app's entry name.
 * @returns {string} An app's root URL.
 */
export const getAppUrl = entryName => {
  // Global app registry defined in the Webpack config
  const appRegistry = __REGISTRY__;

  // Return empty string when registry is empty or not defined
  if (!appRegistry.length) return '';

  const app = appRegistry.find(entry => entry.entryName === entryName);

  if (!app) {
    throw new Error(
      `An app with the entry name '${entryName}' does not exist in the registry. Please make sure your content-build repository is up to date.`,
    );
  }

  return app.rootUrl;
};
