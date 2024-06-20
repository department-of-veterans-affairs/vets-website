import { expect } from 'chai';
import { createStorageKeys } from './index';
import { APP_NAMES } from '../appConstants';

describe('check in', () => {
  describe('session storage utils', () => {
    describe('createSessionStorageKeys', () => {
      it('creates objects with the pre-check-in names', () => {
        const keys = createStorageKeys({ app: APP_NAMES.PRE_CHECK_IN });
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
        const keys = createStorageKeys({ app: APP_NAMES.CHECK_IN });
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
      it('creates objects with the travel-claim names', () => {
        const keys = createStorageKeys({ app: APP_NAMES.TRAVEL_CLAIM });
        expect(keys).to.deep.equal({
          CURRENT_UUID: 'my.health.travel-claim.current.uuid',
          COMPLETE: 'my.health.travel-claim.complete',
          PERMISSIONS: 'my.health.travel-claim.permissions',
          PROGRESS_STATE: 'my.health.travel-claim.progress',
          SHOULD_SEND_TRAVEL_PAY_CLAIM:
            'my.health.travel-claim.should.send.travel.pay.claim',
          TRAVEL_CLAIM_DATA: 'my.health.travel-claim.travel.claim.data',
          TRAVELPAY_SENT: 'my.health.travel-claim.travel.pay.sent',
        });
      });
    });
  });
});
