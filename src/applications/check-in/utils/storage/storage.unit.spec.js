import { expect } from 'chai';
import { createStorageKeys } from './index';

describe('check in', () => {
  describe('session storage utils', () => {
    describe('createSessionStorageKeys', () => {
      it('creates objects with the pre-check-in names', () => {
        const keys = createStorageKeys({ isPreCheckIn: true });
        expect(keys).to.deep.equal({
          CURRENT_UUID: 'health.care.pre.check.in.current.uuid',
          COMPLETE: 'health.care.pre.check.in.complete',
          CHECK_IN_COMPLETE: 'health.care.pre.check.in.check.in.complete',
          SHOULD_SEND_DEMOGRAPHICS_FLAGS:
            'health.care.pre.check.in.should.send.demographics.flags',
          PERMISSIONS: 'health.care.pre.check.in.permissions',
          PROGRESS_STATE: 'health.care.pre.check.in.progress',
        });
      });
      it('creates objects with the check-in names', () => {
        const keys = createStorageKeys({ isPreCheckIn: false });
        expect(keys).to.deep.equal({
          CURRENT_UUID: 'health.care.check-in.current.uuid',
          COMPLETE: 'health.care.check-in.complete',
          CHECK_IN_COMPLETE: 'health.care.check-in.check.in.complete',
          SHOULD_SEND_DEMOGRAPHICS_FLAGS:
            'health.care.check-in.should.send.demographics.flags',
          SHOULD_SEND_TRAVEL_PAY_CLAIM:
            'health.care.check-in.should.send.travel.pay.claim',
          PERMISSIONS: 'health.care.check-in.permissions',
          PROGRESS_STATE: 'health.care.check-in.progress',
          TRAVEL_CLAIM_DATA: 'health.care.check-in.travel.claim.data',
          TRAVELPAY_SENT: 'health.care.check-in.travel.pay.sent',
        });
      });
    });
  });
});
