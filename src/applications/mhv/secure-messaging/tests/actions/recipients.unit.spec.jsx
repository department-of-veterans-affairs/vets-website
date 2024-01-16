import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getAllTriageTeamRecipients } from '../../actions/recipients';
import * as allRecipientsTriageTeamsResponse from '../e2e/fixtures/all-recipients-response.json';

describe('triageTeam actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch action on getAllTriageTeamRecipients', () => {
    const store = mockStore();
    mockApiRequest(allRecipientsTriageTeamsResponse);
    store.dispatch(getAllTriageTeamRecipients()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.AllRecipients.GET_LIST,
        payload: allRecipientsTriageTeamsResponse,
      });
    });
  });
  it('should dispatch action on getAllTriageTeamRecipients error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    store.dispatch(getAllTriageTeamRecipients()).catch(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.AllRecipients.GET_LIST_ERROR,
      });
    });
  });
});
