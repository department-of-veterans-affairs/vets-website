import { Actions } from '../util/actionTypes';
import { getTriageTeamList } from '../api/SmApi';

export const getTriageTeams = () => async dispatch => {
  const response = await getTriageTeamList();
  // TODO Add error handling
  dispatch({
    type: Actions.TriageTeam.GET_LIST,
    response,
  });
};
