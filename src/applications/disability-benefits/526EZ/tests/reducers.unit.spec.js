import { expect } from 'chai';


import {
  PRESTART_STATUS_SET,
  PRESTART_DATA_SET,
  PRESTART_STATE_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES,
  PRESTART_VERIFICATION_TYPES
} from '../actions';

import { prestart } from '../reducer';

describe('prestart', () => {
  it('creates a reducer with initial state', () => {
    const reducer = prestart;
    const state = reducer(undefined, { type: PRESTART_DISPLAY_RESET });
    expect(state.status).to.equal(PRESTART_STATUSES.notAttempted);
    expect(state.data).to.deep.equal({
      verificationType: null,
      currentExpirationDate: null,
      previousExpirationDate: null
    });
    expect(state.display).to.be.false;
  });

  describe('reducer', () => {
    const reducer = prestart;
    it('should set prestart status', () => {
      const state = reducer(undefined, {
        type: PRESTART_STATUS_SET,
        status: PRESTART_STATUSES.succeeded
      });

      expect(state.status).to.equal(PRESTART_STATUSES.succeeded);
      expect(state.display).to.be.true;
    });
    it('should set prestart data', () => {
      const state = reducer(undefined, {
        type: PRESTART_DATA_SET,
        data: {
          verificationType: PRESTART_VERIFICATION_TYPES.retrieve,
          currentExpirationDate: '2019-04-10T15:12:34.000+00:00'
        }
      });

      expect(state.data.currentExpirationDate).to.equal('2019-04-10T15:12:34.000+00:00');
    });
    it('reinitialize state', () => {
      const state = reducer({
        display: true,
        status: PRESTART_STATUSES.succeeded,
        data: {
          verificationType: PRESTART_VERIFICATION_TYPES.create,
          currentExpirationDate: '2019-04-10T15:12:34.000+00:00',
          previousExpirationDate: '2019-04-10T15:12:34.000+00:00'
        }
      }, {
        type: PRESTART_STATE_RESET,
      });

      expect(state.status).to.equal(PRESTART_STATUSES.notAttempted);
      expect(state.data).to.deep.equal({
        verificationType: null,
        currentExpirationDate: null,
        previousExpirationDate: null
      });
      expect(state.display).to.be.false;
    });
    it('reset prestart display', () => {
      const state = reducer({
        display: true,
        status: PRESTART_STATUSES.succeeded,
        data: {
          verificationType: PRESTART_VERIFICATION_TYPES.create,
          currentExpirationDate: '2019-04-10T15:12:34.000+00:00',
          previousExpirationDate: '2019-04-10T15:12:34.000+00:00'
        }
      }, {
        type: PRESTART_DISPLAY_RESET,
      });

      expect(state.display).to.be.false;
    });
  });
});
