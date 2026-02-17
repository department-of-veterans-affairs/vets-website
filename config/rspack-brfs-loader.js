// Passthrough loader for fontkit/linebreak brfs transforms.
// In the original webpack config, transform-loader with brfs was used
// to statically inline fs.readFileSync calls. Since fontkit/linebreak
// are not currently installed, this loader is a no-op passthrough.
// If fontkit is re-added, install brfs and update this loader.
module.exports = function brfsLoader(source) {
  return source;
};
