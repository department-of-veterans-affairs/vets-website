import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getAllTriageTeamRecipients } from '../../actions/allRecipients';
import { allRecipientsReducer } from '../../reducers/allRecipients';
import allRecipientsTriageTeams from '../e2e/fixtures/all-recipients-response.json';

describe('allRecipients reducers', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      allRecipientsReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  it('should dispatch action on getAllTriageTeamRecipients', async () => {
    const store = mockStore();
    mockApiRequest(allRecipientsTriageTeams);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().allRecipients).to.deep.equal(
      allRecipientsTriageTeams.data.map(recipient => {
        return {
          id: recipient.attributes.triageTeamId,
          name: recipient.attributes.name,
          stationNumber: recipient.attributes.stationNumber,
          blockedStatus: recipient.attributes.blockedStatus,
          preferredTeam: recipient.attributes.preferredTeam,
          relationshipType: recipient.attributes.relationshipType,
        };
      }),
    );
  });
  it('should dispatch action on getAllTriageTeamRecipients error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().allRecipients).to.deep.equal('error');
  });
});
