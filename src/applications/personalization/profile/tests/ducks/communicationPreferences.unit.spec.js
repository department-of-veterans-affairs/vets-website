import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '~/platform/utilities/environment';

import { LOADING_STATES } from '~/applications/personalization/common/constants';
import reducer, {
  endpoint,
  fetchCommunicationPreferenceGroups,
  saveCommunicationPreferenceChannel,
  selectChannelById,
  selectGroups,
  selectAvailableChannels,
  selectAvailableGroups,
  selectAvailableItems,
  selectChannelsWithoutSelection,
} from '../../ducks/communicationPreferences';
import error401 from '../fixtures/401.json';
import error500 from '../fixtures/500.json';
import getMinimalCommunicationGroupsSuccess from '../fixtures/communication-preferences/get-200-minimal.json';
import getMaximalCommunicationGroupsSuccess from '../fixtures/communication-preferences/get-200-maximal.json';
import allSelectionsMade from '../fixtures/communication-preferences/get-200-maximal-all-selections.json';
import noSelectionsMade from '../fixtures/communication-preferences/get-200-maximal-no-selections.json';
import postSuccess from '../fixtures/communication-preferences/post-200-success.json';
import patchSuccess from '../fixtures/communication-preferences/patch-200-success.json';

const middleware = [thunk];
const mockStore = configureStore(middleware);

const createState = initialState => actions =>
  actions.reduce(reducer, initialState);

const apiURL = `${environment.API_URL}/v0${endpoint}`;

describe('fetching communication preferences', () => {
  let server;
  let store;
  before(() => {
    server = setupServer(
      rest.get(apiURL, (req, res, ctx) => {
        return res(ctx.json(getMinimalCommunicationGroupsSuccess));
      }),
    );
    server.listen();
  });
  beforeEach(() => {
    store = mockStore(createState({}));
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });
  context('successfully loads a minimal set of preferences', () => {
    it('sets the state properly', () => {
      const promise = store.dispatch(fetchCommunicationPreferenceGroups());

      // check the state before the API call has resolved...
      expect(store.getState().loadingStatus).to.equal(LOADING_STATES.pending);

      // ...and check the state after the API call has resolved
      return promise.then(() => {
        const state = store.getState();
        expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
        expect(state.loadingErrors).to.be.null;
        // expect the state.groups to be correct
        expect(selectGroups(state)).to.deep.equal({
          ids: ['group1'],
          entities: {
            group1: {
              name: 'Health Care',
              description: 'Healthcare Appointment Reminders',
              items: ['item1', 'item2', 'item3'],
            },
          },
        });
        expect(state.items).to.deep.equal({
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
        });
        expect(state.channels).to.deep.equal({
          ids: ['channel1-1', 'channel1-2', 'channel2-1', 'channel3-1'],
          entities: {
            'channel1-1': {
              channelType: 1,
              parentItem: 'item1',
              isAllowed: true,
              permissionId: 1728,
              ui: {
                errors: null,
                updateStatus: LOADING_STATES.idle,
              },
            },
            'channel1-2': {
              channelType: 2,
              parentItem: 'item1',
              isAllowed: null,
              permissionId: null,
              ui: {
                errors: null,
                updateStatus: LOADING_STATES.idle,
              },
            },
            'channel2-1': {
              channelType: 1,
              parentItem: 'item2',
              isAllowed: true,
              permissionId: 341,
              ui: {
                errors: null,
                updateStatus: LOADING_STATES.idle,
              },
            },
            'channel3-1': {
              channelType: 1,
              parentItem: 'item3',
              isAllowed: false,
              permissionId: 342,
              ui: {
                errors: null,
                updateStatus: LOADING_STATES.idle,
              },
            },
          },
        });
      });
    });
  });
  context('when the "Your Health Care" group is in the response', () => {
    it('places it first in the list of groups', () => {
      server.use(
        rest.get(apiURL, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(getMaximalCommunicationGroupsSuccess),
          );
        }),
      );
      const promise = store.dispatch(fetchCommunicationPreferenceGroups());

      return promise.then(() => {
        const state = store.getState();
        expect(state.loadingStatus).to.equal(LOADING_STATES.loaded);
        expect(state.loadingErrors).to.be.null;
        const communicationGroups = selectGroups(state);
        expect(communicationGroups.ids.length).to.equal(3);
        expect(communicationGroups.ids[0]).to.equal('group3');
      });
    });
  });
  describe('errors', () => {
    context('401 error', () => {
      it('sets the state properly', () => {
        server.use(
          rest.get(apiURL, (req, res, ctx) => {
            return res(ctx.status(401), ctx.json(error401));
          }),
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
          rest.get(apiURL, (req, res, ctx) => {
            return res(ctx.status(500), ctx.json(error500));
          }),
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
        server.use(
          rest.get(apiURL, (req, res, ctx) => {
            return res(ctx.json({ data: {} }));
          }),
        );
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
            rest.get(apiURL, (req, res, ctx) => {
              return res(
                ctx.json({
                  data: {
                    attributes: {},
                  },
                }),
              );
            }),
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
  let server;
  let store;
  before(() => {
    server = setupServer(
      rest.post(apiURL, (req, res, ctx) => {
        return res(ctx.json(postSuccess));
      }),
      rest.patch(`${apiURL}/*`, (req, res, ctx) => {
        return res(ctx.json(patchSuccess));
      }),
    );
    server.listen();
  });
  beforeEach(() => {
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
  after(() => {
    server.close();
  });
  context(
    'it first fails to save a permission via POST due to a 401 error and then succeeds on the second attempt',
    () => {
      it('updates the redux state correctly', async () => {
        const channelId = 'channel1-2';
        server.use(
          rest.post(apiURL, (req, res, ctx) => {
            return res(ctx.status(401), ctx.json(error401));
          }),
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
        server.resetHandlers();
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
          rest.patch(`${apiURL}/*`, (req, res, ctx) => {
            return res(ctx.status(500), ctx.json(error500));
          }),
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
        server.resetHandlers();
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

describe('selectors', () => {
  let server;
  let state;
  before(() => {
    server = setupServer(
      rest.get(apiURL, (req, res, ctx) => {
        return res(ctx.json(getMaximalCommunicationGroupsSuccess));
      }),
    );
    server.listen();
  });
  beforeEach(() => {
    const store = mockStore(createState({}));
    const promise = store.dispatch(fetchCommunicationPreferenceGroups());
    return promise.then(() => {
      state = store.getState();
    });
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });
  describe('selectAvailableGroups', () => {
    context('when user is a patient', () => {
      it('keeps the health care group in the full list', () => {
        const availableGroups = selectAvailableGroups(state, {
          isPatient: true,
        });
        expect(availableGroups.ids.length).to.equal(3);
        expect(availableGroups.ids[0]).to.equal('group3');
        expect(availableGroups.entities.group3).to.not.be.undefined;
      });
    });
    context('when user is not a patient', () => {
      it('filters the health care group out of the full list', () => {
        const availableGroups = selectAvailableGroups(state, {
          isPatient: false,
        });
        expect(availableGroups.ids.length).to.equal(2);
        expect(availableGroups.ids[0]).to.equal('group1');
        expect(availableGroups.entities.group3).to.be.undefined;
      });
    });
  });
  describe('selectAvailableItems', () => {
    context('when user is a patient', () => {
      it('keeps the health care items', () => {
        const availableItems = selectAvailableItems(state, {
          isPatient: true,
        });
        expect(availableItems.ids.length).to.equal(4);
        expect(availableItems.entities.item1).to.not.be.undefined;
        expect(availableItems.entities.item3).to.not.be.undefined;
        expect(availableItems.entities.item4).to.not.be.undefined;
      });
    });
    context('when user is not a patient', () => {
      it('filters out the health care items', () => {
        const availableItems = selectAvailableItems(state, {
          isPatient: false,
        });
        expect(availableItems.ids.length).to.equal(2);
        expect(availableItems.entities.item2).to.not.be.undefined;
        expect(availableItems.entities.item1).to.not.be.undefined;
        expect(availableItems.entities.item3).to.be.undefined;
        expect(availableItems.entities.item4).to.be.undefined;
      });
    });
  });
  describe('selectAvailableChannels', () => {
    context('when user is patient and has all contact info on file', () => {
      it('returns the correct channels', () => {
        const availableChannels = selectAvailableChannels(state, {
          isPatient: true,
          hasMobilePhone: true,
          hasEmailAddress: true,
        });
        expect(availableChannels.ids.length).to.equal(5);
      });
    });
    context('when user is patient but lacks a mobile phone', () => {
      it('returns the correct channels', () => {
        const availableChannels = selectAvailableChannels(state, {
          isPatient: true,
          hasMobilePhone: false,
          hasEmailAddress: true,
        });
        expect(availableChannels.ids.length).to.equal(2);
        expect(availableChannels.entities['channel1-2']).to.not.be.undefined;
        expect(availableChannels.entities['channel2-2']).to.not.be.undefined;
      });
    });
    context('when user is not patient and has all contact info on file', () => {
      it('returns the correct channels', () => {
        const availableChannels = selectAvailableChannels(state, {
          isPatient: false,
          hasMobilePhone: true,
          hasEmailAddress: true,
        });
        expect(availableChannels.ids.length).to.equal(3);
        expect(availableChannels.entities['channel2-2']).to.not.be.undefined;
        expect(availableChannels.entities['channel3-1']).to.be.undefined;
        expect(availableChannels.entities['channel4-1']).to.be.undefined;
      });
    });
    context('when user is a patient and has all contact info on file', () => {
      it('returns the correct channels', () => {
        const availableChannels = selectAvailableChannels(state, {
          isPatient: true,
          hasMobilePhone: true,
          hasEmailAddress: true,
        });
        expect(availableChannels.ids.length).to.equal(5);
        expect(availableChannels.entities['channel1-1']).to.not.be.undefined;
        expect(availableChannels.entities['channel1-2']).to.not.be.undefined;
        expect(availableChannels.entities['channel2-2']).to.not.be.undefined;
      });
    });
  });
  describe('selectChannelsWithoutSelection', () => {
    context('when user has not made any selections', () => {
      beforeEach(() => {
        server.use(
          rest.get(apiURL, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(noSelectionsMade));
          }),
        );

        const store = mockStore(createState({}));
        const promise = store.dispatch(fetchCommunicationPreferenceGroups());
        return promise.then(() => {
          state = store.getState();
        });
      });
      it('returns the first channel', () => {
        const channelsWithoutSelection = selectChannelsWithoutSelection(state, {
          isPatient: true,
          hasMobilePhone: true,
          hasEmailAddress: true,
        });
        const ids = channelsWithoutSelection.ids;
        expect(ids.length).to.equal(4);
        expect(channelsWithoutSelection.entities[ids[0]].parentItem).to.equal(
          'item3',
        );
      });
    });
    context('when user has made a selection for all available channels', () => {
      beforeEach(() => {
        server.use(
          rest.get(apiURL, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(allSelectionsMade));
          }),
        );

        const store = mockStore(createState({}));
        const promise = store.dispatch(fetchCommunicationPreferenceGroups());
        return promise.then(() => {
          state = store.getState();
        });
      });
      it('returns no channels', () => {
        const channelsWithoutSelection = selectChannelsWithoutSelection(state, {
          isPatient: true,
          hasMobilePhone: true,
          hasEmailAddress: true,
        });
        expect(channelsWithoutSelection.ids).to.deep.equal([]);
      });
    });
  });
});
