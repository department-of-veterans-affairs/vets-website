import { Actions } from '../util/actionTypes';
import { getLabsAndTests, getLabOrTest } from '../api/MrApi';

export const getLabsAndTestsList = () => async dispatch => {
  const response = await getLabsAndTests();
  dispatch({ type: Actions.LabsAndTests.GET_LIST, response });
};

export const getlabsAndTestsDetails = labId => async dispatch => {
  const response = await getLabOrTest(labId);
  dispatch({ type: Actions.LabsAndTests.GET, response });
};
