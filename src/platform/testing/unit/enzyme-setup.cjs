/**
 * Adapter for enzyme configuration, imported in mocha.
 */

const pkg = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

const { configure } = pkg;

configure({ adapter: new Adapter() });
