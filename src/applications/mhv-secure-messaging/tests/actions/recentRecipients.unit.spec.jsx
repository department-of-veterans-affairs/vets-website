import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  getAllTriageTeamRecipients,
  getRecentRecipients,
} from '../../actions/recipients';

// Utility to build a mock Redux store with EHR data mapping when needed
const middlewares = [thunk];
const mockStore = (initialState = {}) =>
  configureStore(middlewares)(initialState);

const buildAllRecipientsResponse = (list = []) => ({
  data: list.map((attrs, idx) => ({
    id: String(idx + 1),
    type: 'all_triage_teams',
    attributes: attrs,
  })),
  meta: {},
});

describe('actions: getAllTriageTeamRecipients (enhanced)', () => {
  it('dispatches GET_LIST with signatureRequired and healthCareSystemName fallback', async () => {
    const store = mockStore({
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {
              '649': { vamcSystemName: 'Cheyenne VA Medical Center' },
            },
          },
        },
      },
    });

    const response = buildAllRecipientsResponse([
      {
        triageTeamId: 1,
        name: 'Record Amendment Admin', // triggers signatureRequired = true
        stationNumber: '649',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
        // omit healthCareSystemName to force fallback from EHR mapping
      },
      {
        triageTeamId: 2,
        name: 'General Medicine Team', // signatureRequired = false
        stationNumber: '649',
        blockedStatus: false,
        preferredTeam: true,
        relationshipType: 'PATIENT',
        healthCareSystemName: 'Explicit Name', // keep provided value
      },
    ]);

    mockApiRequest(response);

    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST);

    const updated = actions[0].response.data;
    expect(updated[0].attributes.signatureRequired).to.be.true;
    expect(updated[0].attributes.healthCareSystemName).to.equal(
      'Cheyenne VA Medical Center',
    );

    expect(updated[1].attributes.signatureRequired).to.be.false;
    expect(updated[1].attributes.healthCareSystemName).to.equal(
      'Explicit Name',
    );
  });

  it('dispatches GET_LIST_ERROR on API failure', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getAllTriageTeamRecipients());
    const actions = store.getActions();
    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_LIST_ERROR);
  });
});

describe('actions: getRecentRecipients', () => {
  it('dispatches GET_RECENT with unique recipient ids from Sent search', async () => {
    const store = mockStore();
    // searchFolderAdvanced returns an array of message items under data
    const apiResponse = {
      data: [
        { id: 'm1', attributes: { recipientId: 101 } },
        { id: 'm2', attributes: { recipientId: 202 } },
        { id: 'm3', attributes: { recipientId: 101 } }, // duplicate
        { id: 'm4', attributes: { recipientId: 303 } },
      ],
    };
    mockApiRequest(apiResponse);

    await store.dispatch(getRecentRecipients());
    const actions = store.getActions();

    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_RECENT);
    // order preserved by Set over mapped array; expect unique ids only
    expect(actions[0].response).to.deep.equal([101, 202, 303]);
  });

  it('dispatches GET_RECENT with empty array when API returns no data', async () => {
    const store = mockStore();
    mockApiRequest({ data: [] });

    await store.dispatch(getRecentRecipients());
    const actions = store.getActions();

    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_RECENT);
    expect(actions[0].response).to.deep.equal([]);
  });

  it('dispatches GET_RECENT_ERROR on API failure', async () => {
    const store = mockStore();
    mockApiRequest({}, false);

    await store.dispatch(getRecentRecipients());
    const actions = store.getActions();

    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_RECENT_ERROR);
  });

  it('uses custom numberOfMonths parameter when provided', async () => {
    const store = mockStore();
    const apiResponse = {
      data: [
        { id: 'm1', attributes: { recipientId: 101 } },
        { id: 'm2', attributes: { recipientId: 202 } },
      ],
    };
    mockApiRequest(apiResponse);

    await store.dispatch(getRecentRecipients(12)); // Test with 12 months
    const actions = store.getActions();

    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_RECENT);
    expect(actions[0].response).to.deep.equal([101, 202]);
  });

  it('defaults to 6 months when numberOfMonths parameter is not provided', async () => {
    const store = mockStore();
    const apiResponse = {
      data: [{ id: 'm1', attributes: { recipientId: 101 } }],
    };
    mockApiRequest(apiResponse);

    await store.dispatch(getRecentRecipients()); // No parameter provided
    const actions = store.getActions();

    expect(actions[0].type).to.equal(Actions.AllRecipients.GET_RECENT);
    expect(actions[0].response).to.deep.equal([101]);
  });
});
