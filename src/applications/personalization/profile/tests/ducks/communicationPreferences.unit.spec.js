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
  saveCommunicationPreferenceGroup,
  selectGroups,
  selectGroupUi,
} from '../../ducks/communicationPreferences';
import error401 from '../fixtures/401.json';
import error500 from '../fixtures/500.json';
import getMinimalCommunicationGroupsSuccess from '../fixtures/communication-preferences/get-200-minimal.json';
import getMaximalCommunicationGroupsSuccess from '../fixtures/communication-preferences/get-200-maximal.json';
import postCommunicationGroupsSuccess from '../fixtures/communication-preferences/post-200.json';
import patchCommunicationGroupsSuccess from '../fixtures/communication-preferences/patch-200.json';

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
              ui: {
                isEditing: false,
                errors: null,
                updateStatus: LOADING_STATES.idle,
              },
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
            },
            'channel1-2': {
              channelType: 2,
              parentItem: 'item1',
              isAllowed: false,
              permissionId: null,
            },
            'channel2-1': {
              channelType: 1,
              parentItem: 'item2',
              isAllowed: true,
              permissionId: 341,
            },
            'channel3-1': {
              channelType: 1,
              parentItem: 'item3',
              isAllowed: false,
              permissionId: 342,
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

describe('saving a communication preferences group', () => {
  let server;
  let store;
  before(() => {
    server = setupServer(
      rest.post(apiURL, (req, res, ctx) => {
        return res(ctx.json(postCommunicationGroupsSuccess));
      }),
      rest.patch(`${apiURL}/*`, (req, res, ctx) => {
        return res(ctx.json(patchCommunicationGroupsSuccess));
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
            },
            'channel1-2': {
              channelType: 2,
              parentItem: 'item1',
              isAllowed: false,
              permissionId: null,
            },
            'channel2-1': {
              channelType: 1,
              parentItem: 'item2',
              isAllowed: true,
              permissionId: 341,
            },
            'channel3-1': {
              channelType: 1,
              parentItem: 'item3',
              isAllowed: false,
              permissionId: 342,
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
    'successfully sets the value of a single permission for the first time',
    () => {
      it('sets the state properly', () => {
        const promise = store.dispatch(
          saveCommunicationPreferenceGroup('group1', [
            { method: 'POST', endpoint: apiURL, body: {} },
          ]),
        );
        // the updateStatus for that group should be `true` before the API call resolves
        expect(
          store.getState().groups.entities.group1.ui.updateStatus,
        ).to.equal(LOADING_STATES.pending);
        // then the updateStatus for that groups should be `false`
        return promise.then(() => {
          const group1UiState = selectGroupUi(store.getState(), 'group1');
          expect(group1UiState.updateStatus).to.equal(LOADING_STATES.loaded);
          expect(group1UiState.isEditing).to.be.false;
          expect(group1UiState.errors).to.be.null;
        });
      });
    },
  );
  context('successfully saves multiple permissions', () => {
    it('sets the state properly', () => {
      const promise = store.dispatch(
        saveCommunicationPreferenceGroup('group1', [
          { method: 'POST', endpoint: apiURL, body: {} },
          { method: 'POST', endpoint: apiURL, body: {} },
          { method: 'PATCH', endpoint: `${apiURL}/123`, body: {} },
        ]),
      );
      // the updateStatus for that group should be `true` before the API call resolves
      expect(store.getState().groups.entities.group1.ui.updateStatus).to.equal(
        LOADING_STATES.pending,
      );
      // then the updateStatus for that groups should be `false`
      return promise.then(() => {
        const group1UiState = selectGroupUi(store.getState(), 'group1');
        expect(group1UiState.updateStatus).to.equal(LOADING_STATES.loaded);
        expect(group1UiState.isEditing).to.be.false;
        expect(group1UiState.errors).to.be.null;
      });
    });
  });
  context('tries and fails to save a single permission', () => {
    it('sets the state properly', () => {
      server.use(
        rest.post(apiURL, (req, res, ctx) => {
          return res(ctx.status(401), ctx.json(error401));
        }),
      );
      const promise = store.dispatch(
        saveCommunicationPreferenceGroup('group1', [
          { method: 'POST', endpoint: apiURL, body: {} },
        ]),
      );

      expect(store.getState().groups.entities.group1.ui.updateStatus).to.equal(
        LOADING_STATES.pending,
      );
      // then the updateStatus for that groups should be `false`
      return promise.then(() => {
        const group1UiState = selectGroupUi(store.getState(), 'group1');
        expect(group1UiState.updateStatus).to.equal(LOADING_STATES.error);
        expect(group1UiState.isEditing).to.be.true;
        expect(group1UiState.errors).to.deep.equal(error401.errors);
      });
    });
  });
  context(
    'successfully saves a permission but fails to update another permission',
    () => {
      it('sets the state properly', () => {
        server.use(
          rest.patch(`${apiURL}/*`, (req, res, ctx) => {
            return res(ctx.status(500), ctx.json(error500));
          }),
        );
        const promise = store.dispatch(
          saveCommunicationPreferenceGroup('group1', [
            { method: 'POST', endpoint: apiURL, body: {} },
            { method: 'PATCH', endpoint: `${apiURL}/123`, body: {} },
          ]),
        );

        expect(selectGroupUi(store.getState(), 'group1').updateStatus).to.equal(
          LOADING_STATES.pending,
        );
        // then the updateStatus for that groups should be `false`
        return promise.then(() => {
          const group1UiState = selectGroupUi(store.getState(), 'group1');
          expect(group1UiState.updateStatus).to.equal(LOADING_STATES.error);
          expect(group1UiState.isEditing).to.be.true;
          expect(group1UiState.errors).to.deep.equal([error500]);
        });
      });
    },
  );
});
