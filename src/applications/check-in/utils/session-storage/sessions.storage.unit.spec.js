import { expect } from 'chai';
import { createSessionStorageKeys } from './index';

describe('check in', () => {
  describe('session storage utils', () => {
    describe('createSessionStorageKeys', () => {
      it('creates objects with the pre-check-in names', () => {
        const keys = createSessionStorageKeys({ isPreCheckIn: true });
        expect(keys).to.deep.equal({
          CURRENT_UUID: 'health.care.pre.check.in.current.uuid',
          VALIDATE_ATTEMPTS: 'health.care.pre.check.in.validate.attempts',
        });
      });
      it('creates objects with the check-in names', () => {
        const keys = createSessionStorageKeys({ isPreCheckIn: false });
        expect(keys).to.deep.equal({
          CURRENT_UUID: 'health.care.check-in.current.uuid',
          VALIDATE_ATTEMPTS: 'health.care.check-in.validate.attempts',
        });
      });
    });
  });
});
