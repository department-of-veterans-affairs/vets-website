const path = require('path');
const fs = require('fs-extra');

/**
 * Takes an object of CMS feature flags, puts them in a Proxy which
 * throws an error if one is used without being defined, and assigns
 * that to global.cmsFeatureFlags.
 *
 * Returns the Proxy.
 * @param {Object} rawFlags - The CMS feature flags to use
 * @return {Proxy} - A Proxy containing all the feature flags; throws
 *                   an error if a flag is called without existing
 */
function useFlags(rawFlags) {
  const p = new Proxy(rawFlags, {
    get(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      // Not sure where this was getting called, but V8 does some
      // complicated things under the hood.
      // https://www.mattzeunert.com/2016/07/20/proxy-symbol-tostring.html
      // TL;DR: V8 calls some things we don't want to throw up on.
      const ignoreList = [
        'Symbol(Symbol.toStringTag)',
        'Symbol(nodejs.util.inspect.custom)',
        'inspect',
        'Symbol(Symbol.iterator)',
      ];
      if (!ignoreList.includes(prop.toString())) {
        throw new ReferenceError(
          `Could not find feature flag ${prop.toString()}. This could be a typo or the feature flag wasn't returned from Drupal.`,
        );
      }

      // If we get this far, I guess we make sure we don't mess up
      // the expected behavior
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
 * This is for use with the cache and preview scripts. The normal
 * build script does this in setUpFeatureFlags().
 */
async function loadFeatureFlags(cacheDirectory) {
  const featureFlagFile = path.join(
    cacheDirectory,
    'drupal',
    'feature-flags.json',
  );
  const rawFlags = fs.readJsonSync(featureFlagFile);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFlags(rawFlags);
}

module.exports = { loadFeatureFlags, useFlags };
