import { expect } from 'chai';
import { isDetailsReducer } from '../../reducers/isDetails';
import { Actions } from '../../util/actionTypes';

const initialState = {
  currentIsDetails: false,
};

describe('isDetailsReducer toggles currentIsDetails value', () => {
  // Test reducer to toggle currentIsDetails to true
  const state1 = isDetailsReducer(initialState, {
    type: Actions.IsDetails.SET_IS_DETAILS,
    payload: false,
  });
  expect(state1.currentIsDetails).to.equal(false);

  // Test reducer to toggle currentIsDetails back to false
  const state2 = isDetailsReducer(initialState, {
    type: Actions.IsDetails.SET_IS_DETAILS,
    payload: true,
  });
  expect(state2.currentIsDetails).to.equal(true);
});
