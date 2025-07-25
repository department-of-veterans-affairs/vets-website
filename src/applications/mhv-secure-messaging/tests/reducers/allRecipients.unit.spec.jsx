import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getAllTriageTeamRecipients } from '../../actions/recipients';
import { recipientsReducer } from '../../reducers/recipients';
import allRecipientsTriageTeams from '../fixtures/mock-api-responses/all-triage-teams-response.json';
import { RecipientStatus } from '../../util/constants';

describe('allRecipients reducers', () => {
  const mockStore = (initialState = { featureToggles: {} }) => {
    return createStore(recipientsReducer, initialState, applyMiddleware(thunk));
  };

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
});
