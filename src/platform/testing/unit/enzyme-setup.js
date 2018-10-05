/**
 * Adapter for enzyme configuration, imported in mocha.opts
 */

let mockSetup = false;
// Here we're "mocking" enzyme, so that we can delay loading of
// the utility functions until emzyme is imported in tests.
jest.mock('enzyme', () => {
  const actualEnzyme = require.requireActual('enzyme');
  if (!mockSetup) {
    mockSetup = true;
    const Adapter = require('enzyme-adapter-react-15');
    actualEnzyme.configure({ adapter: new Adapter() });
  }
  return actualEnzyme;
});
