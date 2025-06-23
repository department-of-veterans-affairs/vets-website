import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getAllTriageTeamRecipients } from '../../actions/recipients';
import { recipientsReducer } from '../../reducers/recipients';
import allRecipientsTriageTeams from '../fixtures/mock-api-responses/all-triage-teams-response.json';
import { RecipientStatus } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

describe('allRecipients reducers', () => {
  const mockStore = (initialState = {}) => {
    return createStore(recipientsReducer, initialState, applyMiddleware(thunk));
  };
  const actionGetRecentRecipients = Actions.AllRecipients.GET_RECENT;

  it('should dispatch action on getAllTriageTeamRecipients', async () => {
    const store = mockStore();
    mockApiRequest(allRecipientsTriageTeams);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().allRecipients).to.deep.equal(
      allRecipientsTriageTeams.data.map(recipient => {
        return {
          id: recipient.attributes.triageTeamId,
          triageTeamId: recipient.attributes.triageTeamId,
          name: recipient.attributes.name,
          stationNumber: recipient.attributes.stationNumber,
          blockedStatus: recipient.attributes.blockedStatus,
          preferredTeam: recipient.attributes.preferredTeam,
          relationshipType: recipient.attributes.relationshipType,
          type: 'Care Team',
          status: recipient.attributes.blockedStatus
            ? RecipientStatus.BLOCKED
            : RecipientStatus.ALLOWED,
          healthCareSystemName: undefined,
          signatureRequired: false,
        };
      }),
    );
  });
  it('should dispatch action on getAllTriageTeamRecipients error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().error).to.equal(true);
  });

  it('should not dispatch suggestedNameDisplay to name field if suggestedNameDisplay is null', async () => {
    const store = mockStore();
    const recipient = allRecipientsTriageTeams.data[0];
    recipient.attributes.suggestedNameDisplay = null;
    const customMockResponse = { ...allRecipientsTriageTeams };
    customMockResponse.data = [recipient];
    mockApiRequest(customMockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().allRecipients[0].name).to.equal(
      recipient.attributes.name,
    );
  });
  it('should filter and map recentRecipients to allowed, up to 4', () => {
    const initialState = {
      allowedRecipients: [
        { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
        { triageTeamId: 2, name: 'Team Two', healthCareSystemName: 'VAMC B' },
        { triageTeamId: 3, name: 'Team Three', healthCareSystemName: 'VAMC C' },
        { triageTeamId: 4, name: 'Team Four', healthCareSystemName: 'VAMC D' },
        { triageTeamId: 5, name: 'Team Five', healthCareSystemName: 'VAMC E' },
      ],
      recentRecipients: undefined,
    };
    const action = {
      type: actionGetRecentRecipients,
      response: [5, 2, 1, 3, 99], // 99 is not allowed
    };
    const state = recipientsReducer(initialState, action);
    expect(state.recentRecipients).to.deep.equal([
      { triageTeamId: 5, name: 'Team Five', healthCareSystemName: 'VAMC E' },
      { triageTeamId: 2, name: 'Team Two', healthCareSystemName: 'VAMC B' },
      { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
      { triageTeamId: 3, name: 'Team Three', healthCareSystemName: 'VAMC C' },
    ]);
  });

  it('should return [] if no allowed recentRecipients', () => {
    const initialState = {
      allowedRecipients: [
        { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
      ],
      recentRecipients: undefined,
    };
    const action = {
      type: actionGetRecentRecipients,
      response: [99, 100],
    };
    const state = recipientsReducer(initialState, action);
    expect(state.recentRecipients).to.deep.equal([]);
  });

  it('should return [] if response is empty array', () => {
    const initialState = {
      allowedRecipients: [
        { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
      ],
      recentRecipients: undefined,
    };
    const action = {
      type: actionGetRecentRecipients,
      response: [],
    };
    const state = recipientsReducer(initialState, action);
    expect(state.recentRecipients).to.deep.equal([]);
  });

  it('should return [] if response is undefined', () => {
    const initialState = {
      allowedRecipients: [
        { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
      ],
      recentRecipients: undefined,
    };
    const action = {
      type: actionGetRecentRecipients,
      response: undefined,
    };
    const state = recipientsReducer(initialState, action);
    expect(state.recentRecipients).to.deep.equal([]);
  });

  it('should set recentRecipients to "error" on GET_RECENT_ERROR', () => {
    const initialState = {
      allowedRecipients: [],
      recentRecipients: undefined,
    };
    const action = { type: Actions.AllRecipients.GET_RECENT_ERROR };
    const state = recipientsReducer(initialState, action);
    expect(state.recentRecipients).to.equal('error');
  });
});
