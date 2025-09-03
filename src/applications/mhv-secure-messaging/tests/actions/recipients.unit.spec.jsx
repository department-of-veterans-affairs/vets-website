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
