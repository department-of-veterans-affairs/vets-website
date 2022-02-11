import { expect } from 'chai';

import { setApp, SET_APP } from './index';

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
  });
});
