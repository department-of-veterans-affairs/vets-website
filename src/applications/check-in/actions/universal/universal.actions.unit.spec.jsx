import { expect } from 'chai';

import {
  setApp,
  SET_APP,
  recordAnswer,
  RECORD_ANSWER,
  setError,
  SET_ERROR,
} from './index';

describe('check-in', () => {
  describe('universal actions', () => {
    describe('setApp', () => {
      it('should return correct action', () => {
        const action = setApp();
        expect(action.type).to.equal(SET_APP);
      });
      it('should return correct structure', () => {
        const action = setApp('preCheckIn');
        expect(action.payload.app).equal('preCheckIn');
      });
    });
    describe('recordAnswer', () => {
      it('should return correct action', () => {
        const action = recordAnswer({});
        expect(action.type).to.equal(RECORD_ANSWER);
      });
      it('should return correct structure', () => {
        const action = recordAnswer({
          demographicsUpToDate: 'yes',
        });
        expect(action.payload.demographicsUpToDate).equal('yes');
      });
    });
    describe('setError', () => {
      it('should return correct action', () => {
        const action = setError({});
        expect(action.type).to.equal(SET_ERROR);
      });
      it('should return correct structure', () => {
        const action = setError('max-validation');
        expect(action.payload.error).equal('max-validation');
      });
    });
  });
});
