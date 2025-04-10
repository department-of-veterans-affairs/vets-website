import { expect } from 'chai';

import { SET_SESSION, createSetSession } from './index';

describe('check-in', () => {
  describe('actions', () => {
    describe('createSetSession', () => {
      it('should return correct action', () => {
        const action = createSetSession({});
        expect(action.type).to.equal(SET_SESSION);
      });
      it('should return correct structure', () => {
        const action = createSetSession({
          token: 'some-token',
          permissions: 'some-permission',
        });
        expect(action.payload.token).to.equal('some-token');
        expect(action.payload.permissions).to.equal('some-permission');
      });
    });
  });
});
