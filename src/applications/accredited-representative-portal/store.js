import createCommonStore from 'platform/startup/store';
import appReducer from './reducers';

const store = createCommonStore(appReducer);

export default store;
