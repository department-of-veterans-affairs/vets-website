import { expect } from 'chai';

import { makeSelectCheckInData, makeSelectContext } from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectCheckInData', () => {
      it('returns check-in data', () => {
        const state = {
          checkInData: {
            context: {
              token: 'foo',
            },
            seeStaffMessage: 'Test message',
          },
        };
        const selectCheckInData = makeSelectCheckInData();
        expect(selectCheckInData(state)).to.eql({
          context: {
            token: 'foo',
          },
          seeStaffMessage: 'Test message',
        });
      });
    });
    describe('makeSelectContext', () => {
      it('returns check-in context', () => {
        const state = {
          checkInData: {
            context: {
              token: 'foo',
            },
            seeStaffMessage: 'Test message',
          },
        };
        const selectContext = makeSelectContext();
        expect(selectContext(state)).to.eql({
          token: 'foo',
        });
      });
    });
  });
});
