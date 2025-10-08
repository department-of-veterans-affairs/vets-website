/**
 * Adapter for enzyme configuration, imported in mocha.
 */

import pkg from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const { configure } = pkg;

configure({ adapter: new Adapter() });
