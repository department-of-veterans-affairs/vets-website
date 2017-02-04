import { combineReducers } from 'redux';
import ModalDisplayReducer from './modalDisplay';

const rootReducer = combineReducers({
  giModals: ModalDisplayReducer,
});

export default rootReducer;
