import { Actions } from '../util/actionTypes';
import { mockGetLabsAndTestsList } from '../api/MrApi';

export const getLabsAndTestsList = () => async dispatch => {
  const response = await mockGetLabsAndTestsList();
  dispatch({ type: Actions.LabsAndTests.GET_LIST, response });
};
