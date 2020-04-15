function convertAbsolutePathsToRelative(buildOptions) {
  return (files, metalsmith, done) => {
    Object.keys(files).forEach(file => {
      if (file.indexOf(buildOptions.destination) === 0) {
        /* eslint-disable no-param-reassign */
        files[file.substr(buildOptions.destination.length + 1)] = files[file];
        delete files[file];
        /* eslint-enable no-param-reassign */
      }
    });

    done();
  };
}

module.exports = convertAbsolutePathsToRelative;
