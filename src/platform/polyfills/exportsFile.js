const canvasToBlob = require('./canvas-toBlob');
const downloadAttribute = require('./download-attribute');
const polyfillTimezoneData = require('./polyfill-timezone-data');
const preESModulesPolyfills = require('./preESModulesPolyfills');
const index = require('./index');

// exports.preESModulesPolyfills = preESModulesPolyfills;

export default index;
export {
  canvasToBlob,
  downloadAttribute,
  polyfillTimezoneData,
  preESModulesPolyfills,
};
