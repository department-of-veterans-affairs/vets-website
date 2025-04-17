import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import {
  getScheduledDowntime,
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME,
} from '../actions';

describe('getScheduledDowntime', () => {
  const dispatch = sinon.spy();

  beforeEach(() => {
    global.window.dataLayer = [];
    mockFetch();
  });

  afterEach(() => {
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
});
