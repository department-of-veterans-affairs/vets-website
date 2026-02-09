/**
 * Setup to ensure blob-polyfill can load without errors
 * This creates a minimal document and global objects before blob-polyfill tries to access them
 */

// Create minimal document object if it doesn't exist
if (typeof document === 'undefined') {
  global.document = {
    documentElement: {
      style: {}
    },
    addEventListener: function() {},
    removeEventListener: function() {}
  };
}

// Create minimal FileReader if it doesn't exist
if (typeof FileReader === 'undefined') {
  global.FileReader = function() {};
  global.FileReader.prototype = {};
}

// Create minimal File if it doesn't exist  
if (typeof File === 'undefined') {
  global.File = function() {};
  global.File.prototype = {};
}

// Now require blob-polyfill
require('blob-polyfill');
