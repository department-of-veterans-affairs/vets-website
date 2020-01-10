import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment-timezone';
import {
  getScheduledDowntime,
  ERROR_SCHEDULE_DOWNTIME,
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME,
} from '../actions';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  resetFetch,
} from 'platform/testing/unit/helpers';

import defaultExternalServices from '../config/externalServices';

describe('getScheduledDowntime', () => {
  const dispatch = sinon.spy();
  const old = {
    sessionStorage: global.sessionStorage,
    dataLayer: global.window.dataLayer,
  };

  before(() => {
    global.sessionStorage = {};
    global.window.dataLayer = [];
  });

  after(() => {
    global.sessionStorage = old.sessionStorage;
    global.window.dataLayer = old.dataLayer;
  });

  beforeEach(() => mockFetch());

  afterEach(() => {
    resetFetch();
    dispatch.reset();
  });

  it('dispatches the correct actions and maps the data correctly', done => {
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
        expect(firstAction.type).to.be.equal(
          RETRIEVE_SCHEDULED_DOWNTIME,
          'RETRIEVE_SCHEDULED_DOWNTIME was dispatched',
        );
        expect(secondAction.type).to.be.equal(
          RECEIVE_SCHEDULED_DOWNTIME,
          'RECEIVE_SCHEDULED_DOWNTIME was dispatched',
        );
      })
      .then(done, done);
  });

  it('invokes downtime if the response is not ok', async () => {
    const actionCreator = getScheduledDowntime();
    const state = {};

    setFetchJSONFailure(global.fetch, {});
    await actionCreator(dispatch, state);
    const [firstArgs, secondArgs] = dispatch.args;
    const firstAction = firstArgs[0];
    const secondAction = secondArgs[0];
    expect(firstAction.type).to.be.equal(
      RETRIEVE_SCHEDULED_DOWNTIME,
      'RETRIEVE_SCHEDULED_DOWNTIME was dispatched',
    );
    expect(secondAction.type).to.be.equal(
      ERROR_SCHEDULE_DOWNTIME,
      'ERROR_SCHEDULED_DOWNTIME was dispatched',
    );
  });

  // This test passes when the individual file is run
  // but it fails when all tests are run using `test:unit`
  it.skip('creates a global maintenance window', async () => {
    const timezone = 'America/New_York';
    const now = moment().tz(timezone);
    const tomorrow = moment()
      .tz(timezone)
      .add(1, 'day');
    const globalDowntimeWindow = {
      downtimeStart: now,
      downtimeEnd: tomorrow,
    };
    const state = {
      featureToggles: {
        vaGlobalDowntimeNotification: true,
      },
    };
    const actionCreator = getScheduledDowntime(globalDowntimeWindow);
    setFetchJSONFailure(global.fetch, {});
    await actionCreator(dispatch, state);
    const secondArgs = dispatch.args[1];
    const secondAction = secondArgs[0];

    expect(secondAction.data.length).to.be.eql(
      Object.keys(defaultExternalServices).length + 1,
    );
    expect(secondAction.data[0].attributes).to.have.keys(
      'startTime',
      'endTime',
      'externalService',
    );
  });

  it('invokes downtime if the response body has error data', async () => {
    const actionCreator = getScheduledDowntime();
    const state = {};

    setFetchJSONResponse(global.fetch, { errors: [{ status: '500' }] });
    await actionCreator(dispatch, state);
    const [firstArgs, secondArgs] = dispatch.args;
    const firstAction = firstArgs[0];
    const secondAction = secondArgs[0];
    expect(firstAction.type).to.be.equal(
      RETRIEVE_SCHEDULED_DOWNTIME,
      'RETRIEVE_SCHEDULED_DOWNTIME was dispatched',
    );
    expect(secondAction.type).to.be.equal(
      ERROR_SCHEDULE_DOWNTIME,
      'ERROR_SCHEDULED_DOWNTIME was dispatched',
    );
  });
});
