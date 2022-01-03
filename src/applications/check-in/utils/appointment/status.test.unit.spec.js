import { expect } from 'chai';

import { areEqual } from './eligibility';

describe('check in', () => {
  describe('status utils', () => {
    describe('areEqual', () => {
      it('should return true if they match exact', () => {
        expect(areEqual('ELIGIBLE', 'ELIGIBLE')).to.be.true;
      });
      it('should return false if they do not match', () => {
        expect(areEqual('ELIGIBLE', 'cancelled')).to.be.false;
      });
      it('should return false if a is undefined', () => {
        expect(areEqual(undefined, 'ELIGIBLE')).to.be.false;
      });
      it('should return false if b is undefined', () => {
        expect(areEqual('ELIGIBLE', undefined)).to.be.false;
      });
      it('should return true regardless of casing', () => {
        expect(areEqual('ELIGIBLE', 'eligible')).to.be.true;
      });
    });
  });
});
