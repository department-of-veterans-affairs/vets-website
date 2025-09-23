import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  getAllTriageTeamRecipients,
  setActiveCareSystem,
  setActiveCareTeam,
  setActiveDraftId,
  resetRecentRecipient,
} from '../../actions/recipients';
import * as allRecipientsTriageTeamsResponse from '../e2e/fixtures/all-recipients-response.json';

// Import the internal isSignatureRequired function for testing
// Note: This function is not exported, so we'll need to test it through getAllTriageTeamRecipients
// or we can extract it to a utils file for better testability

describe('triageTeam actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);

  it('should dispatch action on getAllTriageTeamRecipients', () => {
    const store = mockStore();
    mockApiRequest(allRecipientsTriageTeamsResponse);
    return store.dispatch(getAllTriageTeamRecipients()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
      expect(actions[0].response.data).to.have.length.greaterThan(0);
      // Verify that processing was applied (signatureRequired added to all recipients)
      const processedData = actions[0].response.data;
      processedData.forEach(recipient => {
        expect(recipient.attributes).to.have.property('signatureRequired');
        expect(recipient.attributes.signatureRequired).to.be.a('boolean');
      });
    });
  });
  it('should dispatch action on getAllTriageTeamRecipients error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    return store.dispatch(getAllTriageTeamRecipients()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST_ERROR);
    });
  });

  describe('signature requirement logic', () => {
    it('should add signatureRequired=true for Privacy Issue_Admin recipients', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Privacy Issue_Admin' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Record Amendment_Admin recipients', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Record Amendment_Admin' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Release of Information Medical Records_Admin recipients', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: {
              name: 'Release of Information Medical Records_Admin',
            },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Oracle Health Release of Information patterns (without _Admin)', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'VHA_123_RELEASE_OF_INFORMATION_ROI' },
          },
          {
            id: '2',
            attributes: {
              name: 'STATE_CITY_RELEASE_OF_INFORMATION_MEDICAL_RECORDS',
            },
          },
          {
            id: '3',
            attributes: { name: 'SOME_RELEASE_OF_INFORMATION_TEAM' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();

        // All Oracle Health ROI patterns should require signature
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
        expect(
          actions[0].response.data[1].attributes.signatureRequired,
        ).to.equal(true);
        expect(
          actions[0].response.data[2].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should NOT add signatureRequired for regular team names', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Regular Team Name' },
          },
          {
            id: '2',
            attributes: { name: 'Privacy Issue Department' }, // Missing _Admin
          },
          {
            id: '3',
            attributes: { name: 'Cardiology Team' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();

        // Regular teams should not have signatureRequired property
        expect(actions[0].response.data[0].attributes.signatureRequired).to.be
          .false;
        expect(actions[0].response.data[1].attributes.signatureRequired).to.be
          .false;
        expect(actions[0].response.data[2].attributes.signatureRequired).to.be
          .false;
      });
    });

    it('should handle mixed recipient types correctly', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Privacy Issues_Admin' }, // Should require signature
          },
          {
            id: '2',
            attributes: { name: 'Regular Team' }, // Should not require signature
          },
          {
            id: '3',
            attributes: { name: 'VHA_456_RELEASE_OF_INFORMATION' }, // Should require signature (Oracle Health)
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
        expect(actions[0].response.data[1].attributes.signatureRequired).to.be
          .false;
        expect(
          actions[0].response.data[2].attributes.signatureRequired,
        ).to.equal(true);
      });
    });
  });
});

describe('isSignatureRequired function (tested through getAllTriageTeamRecipients)', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);

  const createMockRecipientResponse = name => ({
    data: [
      {
        id: '1',
        type: 'triage_teams',
        attributes: {
          name,
          stationNumber: '442',
          healthCareSystemName: 'Cheyenne VA Medical Center',
        },
      },
    ],
  });

  it('should set signatureRequired to true for "Privacy Issue" recipients', async () => {
    const store = mockStore({
      featureToggles: {},
      // Mock the EHR data selector
    });
    const mockResponse = createMockRecipientResponse(
      'Some Team Privacy Issue Admin',
    );
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to true for "Privacy Issues" recipients', async () => {
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse(
      'Test Privacy Issues_Admin',
    );
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to true for "Release of Information Medical Records" recipients', async () => {
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse(
      'Release of Information Medical Records Admin',
    );
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to true for "Record Amendment" recipients', async () => {
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse(
      'Medical Record Amendment_Admin',
    );
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to true for "Release of Information Medical Records" with additional text', async () => {
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse(
      'Release of Information Medical Records Admin',
    );
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to true for matching patterns individually', async () => {
    // Test one case at a time to avoid mocking conflicts
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse('Privacy Issue Admin');
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be.true;
  });

  it('should set signatureRequired to false for non-matching patterns individually', async () => {
    const store = mockStore({
      featureToggles: {},
    });
    const mockResponse = createMockRecipientResponse('Privacy Department');
    mockApiRequest(mockResponse);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);
    expect(actions[0].response.data[0].attributes.signatureRequired).to.be
      .false;
  });
});

// Test coverage for the new action creators

describe('setActiveCareSystem action', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = {}) =>
    configureStore(middlewares)(initialState);

  it('should dispatch SELECT_HEALTH_CARE_SYSTEM action with correct payload', () => {
    const store = mockStore();
    const selectedCareSystem = { id: 'test-system', name: 'Test System' };

    store.dispatch(setActiveCareSystem(selectedCareSystem));
    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({
      type: Actions.AllRecipients.SELECT_HEALTH_CARE_SYSTEM,
      payload: {
        careSystem: selectedCareSystem,
      },
    });
  });
});

describe('setActiveCareTeam action', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = {}) =>
    configureStore(middlewares)(initialState);

  it('should dispatch SELECT_CARE_TEAM action with correct payload', () => {
    const store = mockStore();
    const selectedCareTeam = { id: 'test-team', name: 'Test Team' };

    store.dispatch(setActiveCareTeam(selectedCareTeam));
    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({
      type: Actions.AllRecipients.SELECT_CARE_TEAM,
      payload: {
        careTeam: selectedCareTeam,
      },
    });
  });
});

describe('setActiveDraftId action', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = {}) =>
    configureStore(middlewares)(initialState);

  it('should dispatch SET_ACTIVE_DRAFT_ID action with correct payload', () => {
    const store = mockStore();
    const draftId = 'test-draft-id-123';

    store.dispatch(setActiveDraftId(draftId));
    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({
      type: Actions.AllRecipients.SET_ACTIVE_DRAFT_ID,
      payload: {
        activeDraftId: draftId,
      },
    });
  });
});

describe('resetRecentRecipient action', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = {}) =>
    configureStore(middlewares)(initialState);

  it('should dispatch RESET_RECENT action', () => {
    const store = mockStore();

    store.dispatch(resetRecentRecipient());
    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({
      type: Actions.AllRecipients.RESET_RECENT,
    });
  });
});
