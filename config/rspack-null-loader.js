// Simple null-loader replacement for Rspack
// Returns an empty module for matched files
module.exports = function nullLoader() {
  return 'module.exports = {};';
};
