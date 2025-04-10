import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getTriageTeams } from '../../actions/triageTeams';
import * as triageTeamsResponse from '../e2e/fixtures/recipientsResponse/recipients-response.json';

describe('triageTeam actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch action on getTriageTeams', () => {
    const store = mockStore();
    mockApiRequest(triageTeamsResponse);
    store.dispatch(getTriageTeams()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.TriageTeam.GET_LIST,
        payload: triageTeamsResponse,
      });
    });
  });
  it('should dispatch action on getTriageTeams error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    store.dispatch(getTriageTeams()).catch(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.TriageTeam.GET_LIST_ERROR,
      });
    });
  });
});
