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
          signatureRequired: false,
          healthCareSystemName: undefined,
          ohTriageGroup: recipient.attributes.ohTriageGroup,
          type: 'Care Team',
          status: recipient.attributes.blockedStatus
            ? RecipientStatus.BLOCKED
            : RecipientStatus.ALLOWED,
        };
      }),
    );
    expect(store.getState().vistaFacilities).to.deep.equal(['649']);
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

  it('should correctly set vistaFacilities with multiple facilities', async () => {
    const store = mockStore();
    const customRecipients = [
      {
        id: '1',
        type: 'al_triage_teams',
        attributes: {
          triageTeamId: 1,
          name: 'Team 1',
          stationNumber: '123',
          blockedStatus: false,
          relationshipType: 'PATIENT',
          preferredTeam: true,
          ohTriageGroup: false,
        },
      },
      {
        id: '2',
        type: 'al_triage_teams',
        attributes: {
          triageTeamId: 2,
          name: 'Team 2',
          stationNumber: '456',
          blockedStatus: false,
          relationshipType: 'PATIENT',
          preferredTeam: true,
          ohTriageGroup: false,
        },
      },
      {
        id: '3',
        type: 'al_triage_teams',
        attributes: {
          triageTeamId: 3,
          name: 'Team 3',
          stationNumber: '123',
          blockedStatus: false,
          relationshipType: 'PATIENT',
          preferredTeam: true,
          ohTriageGroup: false,
        },
      },
      {
        id: '4',
        type: 'al_triage_teams',
        attributes: {
          triageTeamId: 4,
          name: 'Team 4',
          stationNumber: '789',
          blockedStatus: true, // Blocked, should not be in vistaFacilities
          relationshipType: 'PATIENT',
          preferredTeam: true,
          ohTriageGroup: false,
        },
      },
      {
        id: '4',
        type: 'al_triage_teams',
        attributes: {
          triageTeamId: 4,
          name: 'Team 4',
          stationNumber: '567',
          blockedStatus: false,
          relationshipType: 'PATIENT',
          preferredTeam: true,
          ohTriageGroup: true, // OH, should not be in vistaFacilities
        },
      },
    ];
    const customMockResponse = {
      data: customRecipients,
      meta: {
        associatedTriageGroups: 4,
        associatedBlockedTriageGroups: 1,
      },
    };
    mockApiRequest(customMockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().vistaFacilities).to.deep.equal(['123', '456']);
  });

  it('should set noAssociations to true when data array is empty', async () => {
    const store = mockStore();
    const emptyMockResponse = {
      data: [],
      meta: {
        associatedTriageGroups: 0,
        associatedBlockedTriageGroups: 0,
      },
    };
    mockApiRequest(emptyMockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().noAssociations).to.equal(true);
    expect(store.getState().allRecipients).to.deep.equal([]);
  });

  it('should set noAssociations to true when associatedTriageGroups is 0 even with data', async () => {
    const store = mockStore();
    const customMockResponse = {
      data: [
        {
          id: '1',
          type: 'al_triage_teams',
          attributes: {
            triageTeamId: 1,
            name: 'Team 1',
            stationNumber: '123',
            blockedStatus: false,
            relationshipType: 'PATIENT',
            preferredTeam: true,
            ohTriageGroup: false,
          },
        },
      ],
      meta: {
        associatedTriageGroups: 0,
        associatedBlockedTriageGroups: 0,
      },
    };
    mockApiRequest(customMockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().noAssociations).to.equal(true);
  });

  it('should set noAssociations to false when data exists and associatedTriageGroups > 0', async () => {
    const store = mockStore();
    const customMockResponse = {
      data: [
        {
          id: '1',
          type: 'al_triage_teams',
          attributes: {
            triageTeamId: 1,
            name: 'Team 1',
            stationNumber: '123',
            blockedStatus: false,
            relationshipType: 'PATIENT',
            preferredTeam: true,
            ohTriageGroup: false,
          },
        },
      ],
      meta: {
        associatedTriageGroups: 1,
        associatedBlockedTriageGroups: 0,
      },
    };
    mockApiRequest(customMockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().noAssociations).to.equal(false);
    expect(store.getState().allRecipients).to.have.lengthOf(1);
  });

  it('should set noAssociations to true when associatedTriageGroups is 0', async () => {
    const store = mockStore();
    const mockResponse = {
      data: [],
      meta: {
        associatedTriageGroups: 0,
        associatedBlockedTriageGroups: 0,
      },
    };
    mockApiRequest(mockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().noAssociations).to.be.true;
  });

  it('should set noAssociations to true when data length is 0', async () => {
    const store = mockStore();
    const mockResponse = {
      data: [],
      meta: {
        associatedTriageGroups: 5,
        associatedBlockedTriageGroups: 0,
      },
    };
    mockApiRequest(mockResponse);
    await store.dispatch(getAllTriageTeamRecipients());
    expect(store.getState().noAssociations).to.be.true;
  });
});
