import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as apiCalls from '../../api/SmApi';
import { Actions } from '../../util/actionTypes';
import { getAllTriageTeamRecipients } from '../../actions/recipients';
import * as allRecipientsTriageTeamsResponse from '../e2e/fixtures/all-recipients-response.json';

describe('triageTeam actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);
  const isPilotState = {
    featureToggles: {
      [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
    },
  };

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

  it('should call getAllRecipients with arg true when isPilot', async () => {
    mockApiRequest(allRecipientsTriageTeamsResponse);
    const store = mockStore(isPilotState);
    const getAllRecipientsSpy = sinon.spy(apiCalls, 'getAllRecipients');
    await store.dispatch(getAllTriageTeamRecipients()).then(() => {
      expect(getAllRecipientsSpy.calledWith(true)).to.be.true;
    });
  });
});
