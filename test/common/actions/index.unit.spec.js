import { expect } from 'chai';
import sinon from 'sinon';
import {
  setCurrentStatus,
  unsetCurrentStatus,
  getScheduledDowntime,
  RECEIVE_SCHEDULED_DOWNTIME,
  RETREIVE_SCHEDULED_DOWNTIME,
  SET_CURRENT_DOWNTIME_STATUS,
  UNSET_CURRENT_DOWNTIME_STATUS,
} from '../../../src/js/common/actions';

describe('setDowntimeStatus', () => {
  const dispatch = sinon.spy();
  const old = { sessionStorage: global.sessionStorage, fetch: global.fetch, dataLayer: global.window.dataLayer };

  before(() => {
    global.window.dataLayer = [];
  });

  after(() => {
    global.window.dataLayer = old.dataLayer;
  });

  it('should dispatch the action', () => {
    const actionCenter = setCurrentStatus('ok');
    actionCenter(dispatch);
    const action = dispatch.args[0][0];
    expect(action.type).to.be.equal(SET_CURRENT_DOWNTIME_STATUS, 'SET_CURRENT_DOWNTIME_STATUS was disptached');
    expect(action.value).to.be.equal('ok', 'Passed the correct status.');
  });
});

describe('unsetDowntimeStatus', () => {
  const dispatch = sinon.spy();
  const old = { sessionStorage: global.sessionStorage, fetch: global.fetch, dataLayer: global.window.dataLayer };

  before(() => {
    global.window.dataLayer = [];
  });

  after(() => {
    global.window.dataLayer = old.dataLayer;
  });

  it('should dispatch the action', () => {
    const actionCenter = unsetCurrentStatus();
    actionCenter(dispatch);
    const action = dispatch.args[0][0];
    expect(action.type).to.be.equal(UNSET_CURRENT_DOWNTIME_STATUS, 'UNSET_CURRENT_DOWNTIME_STATUS was disptached');
  });
});

describe('getScheduledDowntime', () => {
  const dispatch = sinon.spy();
  const old = { sessionStorage: global.sessionStorage, fetch: global.fetch, dataLayer: global.window.dataLayer };
  const fetchResponse = {
    ok: true,
    json() {},
    headers: {
      get: key => ({ 'content-type': 'application/json' }[key])
    }
  };
  const fetch = sinon.spy(() => Promise.resolve(fetchResponse));

  before(() => {
    global.sessionStorage = {};
    global.fetch = fetch;
    global.window.dataLayer = [];
  });

  after(() => {
    global.fetch = old.fetch;
    global.sessionStorage = old.sessionStorage;
    global.window.dataLayer = old.dataLayer;
  });

  beforeEach(() => {
    sinon.spy();
    fetch.reset();
    fetchResponse.json = () => {};
  });

  it('dispatches the correct actions and maps the data correctly', (done) => {
    const actionCreator = getScheduledDowntime();
    const description = 'This is a description';
    const startTime = new Date().toISOString();
    const endTime = new Date(new Date().valueOf() + (24 * 60 * 24 * 1000)).toISOString();
    const raw = {
      data: [
        { id: '139', type: 'maintenance_windows', attributes: { externalService: 'appeals', description, startTime, endTime } },
        { id: '139', type: 'maintenance_windows', attributes: { externalService: 'mhv', description, startTime, endTime } },
      ]
    };
    const mapped = [
      { service: 'appeals', description, startTime: new Date(startTime), endTime: new Date(endTime) },
      { service: 'mhv', description, startTime: new Date(startTime), endTime: new Date(endTime) }
    ];
    fetchResponse.json = () => Promise.resolve(raw);
    actionCreator(dispatch).then(() => {
      const [firstArgs, secondArgs] = dispatch.args;
      const firstAction = firstArgs[0];
      const secondAction = secondArgs[0];
      expect(firstAction.type).to.be.equal(RETREIVE_SCHEDULED_DOWNTIME, 'RETREIVE_SCHEDULED_DOWNTIME was dispatched');
      expect(secondAction.type).to.be.equal(RECEIVE_SCHEDULED_DOWNTIME, 'RECEIVE_SCHEDULED_DOWNTIME was dispatched');
      expect(secondAction.value).to.be.deep.equal(mapped, 'The data was mapped properly');
    }).then(done, done);
  });
});
