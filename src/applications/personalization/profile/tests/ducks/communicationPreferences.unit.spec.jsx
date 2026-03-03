import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import {
  createGetHandler,
  createPostHandler,
  createPatchHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import environment from '~/platform/utilities/environment';

import { LOADING_STATES } from '~/applications/personalization/common/constants';
import reducer, {
  endpoint,
  fetchCommunicationPreferenceGroups,
  saveCommunicationPreferenceChannel,
  selectChannelById,
  selectGroups,
  selectItemById,
  selectGroupById,
} from '../../ducks/communicationPreferences';
import error401 from '../fixtures/401.json';
import error500 from '../fixtures/500.json';
import getMaximalCommunicationGroupsSuccess from '../fixtures/communication-preferences/get-200-maximal.json';
import postSuccess from '../fixtures/communication-preferences/post-200-success.json';
import patchSuccess from '../fixtures/communication-preferences/patch-200-success.json';

const middleware = [thunk];
const mockStore = configureStore(middleware);

const createState = initialState => actions =>
  actions.reduce(reducer, initialState);

const apiURL = `${environment.API_URL}/v0${endpoint}`;

describe('fetching communication preferences', () => {
  let store;
  beforeEach(() => {
    server.use(
      createGetHandler(apiURL, () =>
        jsonResponse(getMaximalCommunicationGroupsSuccess),
      ),
    );
    store = mockStore(createState({}));
  });
  context(
    "when a user's only facility is one that supports Rx tracking",
    () => {
      it('sets the state properly', () => {
        const promise = store.dispatch(
          fetchCommunicationPreferenceGroups({
            facilities: [{ facilityId: '983', isCerner: false }],
          }),
        );

        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
          expect(state.loadingErrors).to.be.null;
          const communicationGroups = selectGroups(state);
          expect(communicationGroups.ids.length).to.equal(5);
          const rxTrackingItem = selectItemById(state, 'item4');
          // The Rx-tracking item exists
          expect(rxTrackingItem).to.exist;
        });
      });
    },
  );
  context(
    'when user has a facility that supports Rx tracking and another that does not',
    () => {
      it('sets the state properly', () => {
        const promise = store.dispatch(
          fetchCommunicationPreferenceGroups({
            facilities: [
              { facilityId: '983', isCerner: true },
              { facilityId: '111', isCerner: false },
            ],
          }),
        );

        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
          expect(state.loadingErrors).to.be.null;
          const communicationGroups = selectGroups(state);
          expect(communicationGroups.ids.length).to.equal(5);
          // The Rx-tracking item exists
          expect(selectItemById(state, 'item4')).to.exist;
        });
      });
    },
  );
  context(
    'when user does not have a facility that supports Rx tracking',
    () => {
      it('sets the state properly', () => {
        const promise = store.dispatch(
          fetchCommunicationPreferenceGroups({
            facilities: [{ facilityId: '111', isCerner: false }],
          }),
        );

        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
          expect(state.loadingErrors).to.be.null;
          const communicationGroups = selectGroups(state);
          expect(communicationGroups.ids.length).to.equal(5);
          // The Rx-tracking item does not exist
          expect(selectItemById(state, 'item4')).not.to.exist;
          // The Rx-tracking item channel does not exist
          expect(selectChannelById(state, 'channel4-1')).not.to.exist;
        });
      });
    },
  );
  context('when user does not have any facilities', () => {
    it('sets the state properly', () => {
      const promise = store.dispatch(
        fetchCommunicationPreferenceGroups({
          facilities: null,
        }),
      );

      return promise.then(() => {
        const state = store.getState();
        expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
        expect(state.loadingErrors).to.be.null;
        const communicationGroups = selectGroups(state);
        // The Health Care group is not in the state
        expect(communicationGroups.ids.length).to.equal(4);
        expect(selectGroupById(state, 'group3')).to.not.exist;
        // The first group is the Applications, claims, etc group
        expect(communicationGroups.ids[0]).to.equal('group1');
        // The Appointment reminder item does not exist
        expect(selectItemById(state, 'item3')).not.to.exist;
        // The Rx-tracking item does not exist
        expect(selectItemById(state, 'item4')).not.to.exist;
      });
    });
  });
  describe('errors', () => {
    context('401 error', () => {
      it('sets the state properly', () => {
        server.use(
          createGetHandler(apiURL, () =>
            jsonResponse(error401, { status: 401 }),
          ),
        );
        const promise = store.dispatch(fetchCommunicationPreferenceGroups());

        // check the state before the API call has resolved...
        expect(store.getState().loadingStatus).to.equal(LOADING_STATES.pending);

        // ...and check the state after the API call has failed
        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.error);
          expect(state.loadingErrors).to.deep.equal(error401.errors);
        });
      });
    });
    context('500 error', () => {
      it('sets the state properly', () => {
        server.use(
          createGetHandler(apiURL, () =>
            jsonResponse(error500, { status: 500 }),
          ),
        );
        const promise = store.dispatch(fetchCommunicationPreferenceGroups());

        // check the state before the API call has resolved...
        expect(store.getState().loadingStatus).to.equal(LOADING_STATES.pending);

        // ...and check the state after the API call has failed
        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.error);
          expect(state.loadingErrors).to.deep.equal([error500]);
        });
      });
    });
    context('response is missing `data.attributes`', () => {
      it('sets the state properly', () => {
        server.use(createGetHandler(apiURL, () => jsonResponse({ data: {} })));
        const promise = store.dispatch(fetchCommunicationPreferenceGroups());

        expect(store.getState().loadingStatus).to.equal(LOADING_STATES.pending);

        return promise.then(() => {
          const state = store.getState();
          expect(state.loadingStatus).to.equal(LOADING_STATES.error);
          expect(state.loadingErrors.length).to.equal(1);
        });
      });
    });
    context(
      'response is missing the `data.attributes.communicationGroups` prop',
      () => {
        it('sets the state properly', () => {
          server.use(
            createGetHandler(apiURL, () =>
              jsonResponse({
                data: {
                  attributes: {},
                },
              }),
            ),
          );
          const promise = store.dispatch(fetchCommunicationPreferenceGroups());

          // check the state before the API call has resolved...
          expect(store.getState().loadingStatus).to.equal(
            LOADING_STATES.pending,
          );

          // ...and check the state after the API call has succeeded but the
          // response object is missing the communicationGroups property
          return promise.then(() => {
            const state = store.getState();
            expect(state.loadingStatus).to.equal(LOADING_STATES.error);
            expect(state.loadingErrors.length).to.equal(1);
          });
        });
      },
    );
  });
});

describe('saveCommunicationPreferenceChannel', () => {
  let store;
  beforeEach(() => {
    server.use(
      createPostHandler(apiURL, () => jsonResponse(postSuccess)),
      createPatchHandler(`${apiURL}/*`, () => jsonResponse(patchSuccess)),
    );
    store = mockStore(
      createState({
        loadingStatus: 'loaded',
        loadingErrors: null,
        groups: {
          ids: ['group1'],
          entities: {
            group1: {
              name: 'Health Care',
              description: 'Healthcare Appointment Reminders',
              ui: { isEditing: true, updateStatus: 'idle', errors: null },
              items: ['item1', 'item2', 'item3'],
            },
          },
        },
        items: {
          ids: ['item1', 'item2', 'item3'],
          entities: {
            item1: {
              name: 'Health Appointment Reminder',
              channels: ['channel1-1', 'channel1-2'],
            },
            item2: {
              name: 'RX Prescription Refill Reminder',
              channels: ['channel2-1'],
            },
            item3: {
              name: 'Scheduled Appointment Confirmation',
              channels: ['channel3-1'],
            },
          },
        },
        channels: {
          ids: ['channel1-1', 'channel1-2', 'channel2-1', 'channel3-1'],
          entities: {
            'channel1-1': {
              channelType: 1,
              parentItem: 'item1',
              isAllowed: true,
              permissionId: 1728,
              ui: {
                updateStatus: LOADING_STATES.idle,
                errors: null,
              },
            },
            'channel1-2': {
              channelType: 2,
              parentItem: 'item1',
              isAllowed: null,
              permissionId: null,
              ui: {
                updateStatus: LOADING_STATES.idle,
                errors: null,
              },
            },
            'channel2-1': {
              channelType: 1,
              parentItem: 'item2',
              isAllowed: true,
              permissionId: 341,
              ui: {
                updateStatus: LOADING_STATES.idle,
                errors: null,
              },
            },
            'channel3-1': {
              channelType: 1,
              parentItem: 'item3',
              isAllowed: false,
              permissionId: 342,
              ui: {
                updateStatus: LOADING_STATES.idle,
                errors: null,
              },
            },
          },
        },
      }),
    );
  });
  afterEach(() => {
    server.resetHandlers();
  });
  context(
    'it first fails to save a permission via POST due to a 401 error and then succeeds on the second attempt',
    () => {
      it('updates the redux state correctly', async () => {
        const channelId = 'channel1-2';
        server.use(
          createPostHandler(apiURL, () =>
            jsonResponse(error401, { status: 401 }),
          ),
        );
        const originalState = selectChannelById(store.getState(), channelId);
        let promise = store.dispatch(
          saveCommunicationPreferenceChannel(channelId, {
            method: 'POST',
            endpoint: apiURL,
            body: {},
            isAllowed: true,
            wasAllowed: null,
          }),
        );
        // it should set that part of the UI as loading
        let channelState = selectChannelById(store.getState(), channelId);
        expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.pending);
        // it should flip the isAllowed flag while the call is in flight
        expect(channelState.isAllowed).to.equal(!originalState.isAllowed);
        // the update call fails
        // it should then set the channel's redux state correctly
        await promise.then(() => {
          channelState = selectChannelById(store.getState(), channelId);
          expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.error);
          expect(channelState.ui.errors).to.deep.equal(error401.errors);
          // it should flip the isAllowed flag back to where it started
          expect(channelState.isAllowed).to.equal(originalState.isAllowed);
          expect(channelState.permissionId).to.equal(
            originalState.permissionId,
          );
        });
        // now make the API work correctly and try to update the pref again
        // Re-add success handlers (resetHandlers would clear all handlers)
        server.use(createPostHandler(apiURL, () => jsonResponse(postSuccess)));
        promise = store.dispatch(
          saveCommunicationPreferenceChannel(channelId, {
            method: 'POST',
            endpoint: apiURL,
            body: {},
            isAllowed: true,
            wasAllowed: null,
          }),
        );
        channelState = selectChannelById(store.getState(), channelId);
        // it should set that part of the UI as loading
        expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.pending);
        expect(channelState.isAllowed).to.equal(!originalState.isAllowed);
        // the update call succeeds
        // it should then set the channel's redux state correctly
        await promise.then(() => {
          channelState = selectChannelById(store.getState(), channelId);
          expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.loaded);
          expect(channelState.ui.errors).to.equal(null);
          expect(channelState.isAllowed).to.equal(postSuccess.bio.allowed);
          expect(channelState.permissionId).to.equal(
            postSuccess.bio.communicationPermissionId,
          );
        });
      });
    },
  );
  context(
    'it first fails to save a permission via PATCH due to a 500 error and then succeeds on the second attempt',
    () => {
      it('updates the redux state correctly', async () => {
        const channelId = 'channel1-1';
        server.use(
          createPatchHandler(`${apiURL}/*`, () =>
            jsonResponse(error500, { status: 500 }),
          ),
        );
        const originalState = selectChannelById(store.getState(), channelId);
        let promise = store.dispatch(
          saveCommunicationPreferenceChannel(channelId, {
            method: 'PATCH',
            endpoint: `${apiURL}/1728`,
            body: {},
            isAllowed: false,
            wasAllowed: true,
          }),
        );
        // it should set that part of the UI as loading
        let channelState = selectChannelById(store.getState(), channelId);
        expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.pending);
        expect(channelState.isAllowed).to.equal(!originalState.isAllowed);
        // the update call fails
        // it should then set the channel's redux state correctly
        await promise.then(() => {
          channelState = selectChannelById(store.getState(), channelId);
          expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.error);
          expect(channelState.ui.errors).to.deep.equal([error500]);
          expect(channelState.isAllowed).to.equal(originalState.isAllowed);
          expect(channelState.permissionId).to.equal(
            originalState.permissionId,
          );
        });
        // now make the API work correctly and try to update the pref again
        // Re-add success handlers (resetHandlers would clear all handlers)
        server.use(
          createPatchHandler(`${apiURL}/*`, () => jsonResponse(patchSuccess)),
        );
        promise = store.dispatch(
          saveCommunicationPreferenceChannel(channelId, {
            method: 'PATCH',
            endpoint: `${apiURL}/1728`,
            body: {},
            isAllowed: false,
            wasAllowed: true,
          }),
        );
        // it should set that part of the UI as loading
        channelState = selectChannelById(store.getState(), channelId);
        expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.pending);
        expect(channelState.isAllowed).to.equal(!originalState.isAllowed);
        // the update call succeeds
        // it should then set the channel's redux state correctly
        await promise.then(() => {
          channelState = selectChannelById(store.getState(), channelId);
          expect(channelState.ui.updateStatus).to.equal(LOADING_STATES.loaded);
          expect(channelState.ui.errors).to.equal(null);
          expect(channelState.isAllowed).to.equal(patchSuccess.bio.allowed);
          expect(channelState.permissionId).to.equal(
            patchSuccess.bio.communicationPermissionId,
          );
        });
      });
    },
  );
});
