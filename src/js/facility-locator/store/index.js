import createCommonStore from '../../common/store';
import reducer from '../reducers';

export const store = createCommonStore(reducer);
