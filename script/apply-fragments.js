/* eslint-disable no-continue */

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

function applyFragments(buildOptions) {
  return (files, smith, done) => {
    const fragmentsRoot = smith.path(buildOptions.contentFragments);

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (!file.fragments) continue;

      for (const fragmentName of Object.keys(file.fragments)) {
        const fragmentFileName = file.fragments[fragmentName];
        const fileLocation = path.join(
          fragmentsRoot,
          `${fragmentFileName}.yml`,
        );
        const fragmentFile = fs.readFileSync(fileLocation);

        file[fragmentName] = yaml.safeLoad(fragmentFile);
      }
    }

    done();
  };
}

module.exports = applyFragments;
