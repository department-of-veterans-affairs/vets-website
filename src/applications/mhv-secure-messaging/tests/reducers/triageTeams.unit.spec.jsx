import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getTriageTeams } from '../../actions/triageTeams';
import { triageTeamsReducer } from '../../reducers/triageTeams';
import triageTeamsResponse from '../e2e/fixtures/recipientsResponse/recipients-response.json';

describe('triageTeam reducers', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      triageTeamsReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  it('should dispatch action on getTriageTeams', async () => {
    const store = mockStore();
    mockApiRequest(triageTeamsResponse);
    await store.dispatch(getTriageTeams());
    expect(store.getState().triageTeams).to.deep.equal(
      triageTeamsResponse.data.map(triageTeam => {
        return {
          id: triageTeam.attributes.triageTeamId,
          name: triageTeam.attributes.name,
          relationType: triageTeam.attributes.relationType,
          preferredTeam: triageTeam.attributes.preferredTeam,
        };
      }),
    );
  });
  it('should dispatch action on getTriageTeams error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getTriageTeams());
    expect(store.getState().triageTeams).to.deep.equal('error');
  });
});
