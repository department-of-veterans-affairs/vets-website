import sinon from 'sinon';
import {
  getScheduledDowntime,
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME,
} from '../actions';
import {
  mockFetch,
  setFetchJSONResponse,
  resetFetch,
} from 'platform/testing/unit/helpers';

describe('getScheduledDowntime', () => {
  const dispatch = sinon.spy();
  const old = {
    sessionStorage: global.sessionStorage,
    dataLayer: global.window.dataLayer,
  };

  beforeAll(() => {
    global.sessionStorage = {};
    global.window.dataLayer = [];
  });

  afterAll(() => {
    global.sessionStorage = old.sessionStorage;
    global.window.dataLayer = old.dataLayer;
  });

  beforeEach(() => mockFetch());

  afterEach(() => {
    resetFetch();
    dispatch.reset();
  });

  test('dispatches the correct actions and maps the data correctly', done => {
    const actionCreator = getScheduledDowntime();
    const description = 'This is a description';
    const startTime = new Date().toISOString();
    const endTime = new Date(
      new Date().valueOf() + 24 * 60 * 24 * 1000,
    ).toISOString();
    const raw = {
      data: [
        {
          id: '139',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'appeals',
            description,
            startTime,
            endTime,
          },
        },
        {
          id: '139',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'mhv',
            description,
            startTime,
            endTime,
          },
        },
      ],
    };

    const state = {};

    setFetchJSONResponse(global.fetch, raw);
    actionCreator(dispatch, state)
      .then(() => {
        const [firstArgs, secondArgs] = dispatch.args;
        const firstAction = firstArgs[0];
        const secondAction = secondArgs[0];
        expect(firstAction.type).toBe(RETRIEVE_SCHEDULED_DOWNTIME);
        expect(secondAction.type).toBe(RECEIVE_SCHEDULED_DOWNTIME);
      })
      .then(done, done);
  });
});
