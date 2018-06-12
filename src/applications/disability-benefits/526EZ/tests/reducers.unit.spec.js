import { expect } from 'chai';


import {
  SET_PRESTART_STATUS,
  RESET_PRESTART_STATUS,
  RESET_PRESTART_DISPLAY,
  PRESTART_STATUSES,
} from '../actions';

import { prestart } from '../reducer';

describe('prestart', () => {
  it('creates a reducer with initial state', () => {
    const reducer = prestart;
    const state = reducer(undefined, { type: RESET_PRESTART_DISPLAY });
    expect(state.status).to.equal(PRESTART_STATUSES.notAttempted);
    expect(state.data).to.be.undefined;
    expect(state.display).to.be.false;
  });

  describe('reducer', () => {
    const reducer = prestart;
    it('should set prestart status', () => {
      const state = reducer(undefined, {
        type: SET_PRESTART_STATUS,
        status: PRESTART_STATUSES.none
      });

      expect(state.status).to.equal(PRESTART_STATUSES.none);
      expect(state.display).to.be.true;
      expect(state.data).to.be.undefined;
    });

    it('should set prestart data when none already exists', () => {
      const state = reducer(undefined, {
        type: SET_PRESTART_STATUS,
        status: PRESTART_STATUSES.retrieved,
        data: '2019-04-10T15:12:34.000+00:00'
      });

      expect(state.status).to.equal(PRESTART_STATUSES.retrieved);
      expect(state.display).to.be.true;
      expect(state.data).to.equal('2019-04-10T15:12:34.000+00:00');
    });
    it('should set prestart data when data already exists', () => {
      const data = {
        previous: '2019-04-10T15:12:34.000+00:00',
        current: '2018-04-10T15:12:36.000+00:00'
      };
      const state = reducer({
        status: PRESTART_STATUSES.expired,
        data: '2019-04-10T15:12:34.000+00:00',
        display: true
      }, {
        type: SET_PRESTART_STATUS,
        status: PRESTART_STATUSES.renewed,
        data: '2018-04-10T15:12:36.000+00:00'
      });

      expect(state.status).to.equal(PRESTART_STATUSES.renewed);
      expect(state.display).to.be.true;
      expect(state.data).to.deep.equal(data);
    });
    it('reset prestart status', () => {
      const state = reducer({
        display: true,
        status: PRESTART_STATUSES.retrieved,
        data: '2019-04-10T15:12:34.000+00:00'
      }, {
        type: RESET_PRESTART_STATUS,
      });

      expect(state.status).to.equal(PRESTART_STATUSES.notAttempted);
    });
    it('reset prestart display', () => {
      const state = reducer({
        display: true,
        status: PRESTART_STATUSES.retrieved,
        data: '2019-04-10T15:12:34.000+00:00'
      }, {
        type: RESET_PRESTART_DISPLAY,
      });

      expect(state.display).to.be.false;
    });
  });
});
