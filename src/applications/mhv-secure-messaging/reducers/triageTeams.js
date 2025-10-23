import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * List of triage teams (recipients) for the current user
   * @type {array}
   */
  triageTeams: undefined,
};

export const triageTeamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.TriageTeam.GET_LIST:
      return {
        ...state,
        triageTeams: action.response.data.map(triageTeam => {
          return {
            id: triageTeam.attributes.triageTeamId,
            name: triageTeam.attributes.name,
            relationType: triageTeam.attributes.relationType,
            preferredTeam: triageTeam.attributes.preferredTeam,
          };
        }),
      };
    case Actions.TriageTeam.GET_LIST_ERROR:
      return {
        ...state,
        triageTeams: 'error',
      };
    default:
      return state;
  }
};
