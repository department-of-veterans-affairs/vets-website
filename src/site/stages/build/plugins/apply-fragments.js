/* eslint-disable no-continue, no-param-reassign */

/**
 * Files can contain a "fragments" property in the front matter, which can be
 * used to read a YAML file into a property name.
 *
 * For example, if "index.md" contains front matter:
 *
 * ------
 * title: Home
 * banner:
 *   visible: true
 *   type: warning
 *   title: Some VA.gov tools and features may not be working as expected
 *   content: Some content
 * ------
 *
 * You could break out the "banner" property into a separate file via fragments.
 * index.md could be rewritten with fragments like:
 *
 * ------
 * title: Home
 * fragments:
 *   banner: home/banner
 * ------
 *
 * Then, in "{fragments_root}/home/banner.yml", you could store the banner data -
 *
 * visible: true
 * type: warning
 * title: Some VA.gov tools and features may not be working as expected
 * content: Some content
 *
 * This would produce the same result as the original index.md.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadFragment(buildOptions, smith, fragmentFileName) {
  const fragmentsRoot = smith.path(buildOptions.contentFragments);
  const fileLocation = path.join(fragmentsRoot, `${fragmentFileName}.yml`);
  const fragmentFile = fs.readFileSync(fileLocation);
  return yaml.safeLoad(fragmentFile);
}

function applyFragments(buildOptions, smith, object) {
  for (const fragmentName of Object.keys(object.fragments)) {
    const fragmentFileName = object.fragments[fragmentName];

    object[fragmentName] = loadFragment(buildOptions, smith, fragmentFileName);
  }
}

function applyFragmentsMiddleware(buildOptions) {
  return (files, smith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (!file.fragments) continue;

      applyFragments(buildOptions, smith, file);
    }

    done();
  };
}

module.exports = applyFragmentsMiddleware;
module.exports.applyFragments = applyFragments;
