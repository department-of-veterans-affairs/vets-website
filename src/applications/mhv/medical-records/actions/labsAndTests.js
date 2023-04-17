import { Actions } from '../util/actionTypes';
import { mockGetLabAndTest, mockGetLabsAndTestsList } from '../api/MrApi';

export const getLabsAndTestsList = () => async dispatch => {
  const response = await mockGetLabsAndTestsList();
  dispatch({ type: Actions.LabsAndTests.GET_LIST, response });
};

export const getLabAndTest = labId => async dispatch => {
  const response = await mockGetLabAndTest(labId);
  dispatch({ type: Actions.LabsAndTests.GET, response });
};
