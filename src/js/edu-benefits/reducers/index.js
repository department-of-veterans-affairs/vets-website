import { combineReducers } from 'redux';

let initState = {};
let placeholder = (state = initState, action) => state;

export default combineReducers({
  placeholder
});
