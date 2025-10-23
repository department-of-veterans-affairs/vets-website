import { SET_SUGGESTED_ADDRESS_PICKED } from '../actions';

const initialState = {
  isSuggestedAddressPicked: false,
};
const suggestedAddress = (state = initialState, action) => {
  if (action.type === SET_SUGGESTED_ADDRESS_PICKED) {
    return {
      ...state,
      isSuggestedAddressPicked: action.payload,
    };
  }
  return state;
};

export default suggestedAddress;
