const path = require('path');
const fs = require('fs-extra');

/**
 * Takes an object of CMS feature flags, puts them in a Proxy which
 * logs an error if one is used without being defined, and assigns
 * that to global.cmsFeatureFlags.
 *
 * Returns the Proxy.
 * @param {Object} rawFlags - The CMS feature flags to use
 * @param {Bool} shouldLog - Whether to log any missing flags or not
 * @return {Proxy} - A Proxy containing all the feature flags; throws
 *                   an error if a flag is called without existing
 */
function useFlags(rawFlags, shouldLog = true) {
  // eslint-disable-next-line fp/no-proxy
  const p = new Proxy(rawFlags, {
    get(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      // Not sure where this was getting called, but V8 does some
      // complicated things under the hood.
      // https://www.mattzeunert.com/2016/07/20/proxy-symbol-tostring.html
      // TL;DR: V8 calls some things we don't need to mention
      const ignoreList = [
        'Symbol(Symbol.toStringTag)',
        'Symbol(nodejs.util.inspect.custom)',
        'inspect',
        'Symbol(Symbol.iterator)',
      ];
      if (!ignoreList.includes(prop.toString()) && shouldLog) {
        // TODO: make this error message more helpful and less noisy, i.e.
        // - only log once rather than 100's of times
        // - indicate the solution may be to pass the --pull-drupal flag to the build.
        // eslint-disable-next-line no-console
        console.error(
          `Could not find query flag ${prop.toString()}. This could be a typo or the feature flag wasn't returned from Drupal.`,
        );
      }

      return obj[prop];
    },
  });

  global.cmsFeatureFlags = p;

  return p;
}

/**
 * Attempt to load the feature flags from the file and put them in
 * global.cmsFeatureFlags.
 *
 * This is for use with the drupal-aws-cache script. The normal build
 * and preview build scripts do this in setUpFeatureFlags().
 *
 * This function doesn't check for the existence of a feature flags file
 * because those should have already been pulled using --pull-drupal.
 * Not having a failsafe allows for better visibility into any potential
 * error messages and prevents the upload of a cache without feature flags.
 */
function loadFeatureFlags(cacheDirectory) {
  const featureFlagFile = path.join(cacheDirectory, 'feature-flags.json');
  const rawFlags = fs.readJsonSync(featureFlagFile);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFlags(rawFlags);
}

module.exports = { loadFeatureFlags, useFlags };
