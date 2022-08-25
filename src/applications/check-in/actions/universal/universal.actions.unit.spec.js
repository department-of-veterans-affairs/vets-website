import { expect } from 'chai';

import { setApp, SET_APP, recordAnswer, RECORD_ANSWER } from './index';

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
  });
});
