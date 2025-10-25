/**
 * Adapter for enzyme configuration, imported in mocha.
 * Compatible with Node v20+ by using require instead of ES6 import
 */

try {
  const enzyme = require('enzyme');
  const AdapterModule = require('@wojtekmaj/enzyme-adapter-react-17');
  const Adapter = AdapterModule.default || AdapterModule;
  
  enzyme.configure({ adapter: new Adapter() });
} catch (error) {
  // Silently fail if enzyme is not needed for the current test
  // This allows tests that don't use enzyme to run without issues
  if (process.env.LOG_LEVEL === 'debug') {
    console.warn('Enzyme setup failed:', error.message);
  }
}
