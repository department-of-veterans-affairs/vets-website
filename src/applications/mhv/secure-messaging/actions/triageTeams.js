import { Actions } from '../util/actionTypes';
import { getTriageTeamList } from '../api/SmApi';

export const getTriageTeams = () => async dispatch => {
  const response = await getTriageTeamList();

  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: Actions.TriageTeam.GET_LIST,
      response,
    });
  }
};
