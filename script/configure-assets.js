function addAssetHashes() {
  // In non-development modes, we add hashes to the names of asset files in order to support
  // cache busting. That is done via WebPack, but WebPack doesn't know anything about our HTML
  // files, so we have to replace the references to those files in HTML and CSS files after the
  // rest of the build has completed. This is done by reading in a manifest file created by
  // WebPack that maps the original file names to their hashed versions. Metalsmith actions
  // are passed a list of files that are included in the build. Those files are not yet written
  // to disk, but the contents are held in memory.

  return (files, metalsmith, done) => {
    // Read in the data from the manifest file.
    const manifestKey = Object.keys(files).find(
      filename => filename.match(/file-manifest.json$/) !== null,
    );

    const originalManifest = JSON.parse(files[manifestKey].contents.toString());

    // The manifest contains the original filenames without the addition of .entry
    // on the JS files. This finds all of those and modifies them to add .entry.
    const manifest = {};
    Object.keys(originalManifest).forEach(originalManifestKey => {
      const matchData = originalManifestKey.match(/(.*)\.js$/);
      if (matchData !== null) {
        const newKey = `${matchData[1]}.entry.js`;
        manifest[newKey] = originalManifest[originalManifestKey];
      } else {
        manifest[originalManifestKey] = originalManifest[originalManifestKey];
      }
    });

    // For each file in the build, if it is a HTML or CSS file, loop over all
    // the keys in the manifest object and do a search and replace for the
    // key with the value.
    Object.keys(files).forEach(filename => {
      if (filename.match(/\.(html|css)$/) !== null) {
        Object.keys(manifest).forEach(originalAssetFilename => {
          const newAssetFilename = manifest[originalAssetFilename].replace(
            '/generated/',
            '',
          );
          const file = files[filename];
          const contents = file.contents.toString();
          const regex = new RegExp(originalAssetFilename, 'g');
          file.contents = new Buffer(contents.replace(regex, newAssetFilename));
        });
      }
    });
    done();
  };
}

module.exports = addAssetHashes;
