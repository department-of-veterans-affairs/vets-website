import { Actions } from '../util/actionTypes';
import { getTriageTeamList } from '../api/SmApi';

export const getTriageTeams = () => async dispatch => {
  try {
    const response = await getTriageTeamList();
    dispatch({
      type: Actions.TriageTeam.GET_LIST,
      response,
    });
  } catch (error) {
    dispatch({
      type: Actions.TriageTeam.GET_LIST_ERROR,
    });
  }
};
