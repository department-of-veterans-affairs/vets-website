/**
 * Adapter for enzyme configuration, imported in mocha.
 */

import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const { configure } = enzyme;
configure({ adapter: new Adapter() });
