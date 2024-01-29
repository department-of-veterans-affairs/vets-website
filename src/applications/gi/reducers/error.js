import { SET_ERROR } from '../actions';

const initialState = {
  error: null,
};
const errorReducer = (state = initialState, action) => {
  //     switch(action.type){
  //         case SET_ERROR:
  //             return{
  //                 ...state,
  //                 error:action.payload
  //             };
  //             default:
  //                 return state;
  //     }
  if (action.type === SET_ERROR) {
    return {
      ...state,
      error: action.payload,
    };
  }
  return state;
};
export default errorReducer;
