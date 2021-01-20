/**
 * Adapter for enzyme configuration, imported in mocha.
 */

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
