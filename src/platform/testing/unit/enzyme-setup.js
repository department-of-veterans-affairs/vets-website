/**
 * Adapter for enzyme configuration, imported in mocha.
 */

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const { configure } = Enzyme;
configure({ adapter: new Adapter() });
