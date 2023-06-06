import { expect } from 'chai';

import {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
  makeSelectSeeStaffMessage,
  makeSelectApp,
  makeSelectError,
} from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectForm', () => {
      const state = {
        checkInData: {
          form: {
            pages: [],
          },
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectForm();
        expect(selectFeatureToggles(state)).to.eql({
          pages: [],
        });
      });
    });
    describe('makeSelectCurrentContext', () => {
      const state = {
        checkInData: {
          context: {
            token: 'some-token',
            permissions: 'some-permissions',
          },
        },
      };
      it('returns feature toggles', () => {
        const selectCurrentContext = makeSelectCurrentContext();
        expect(selectCurrentContext(state)).to.eql({
          token: 'some-token',
          permissions: 'some-permissions',
        });
      });
    });
    describe('makeSelectVeteranData', () => {
      const state = {
        checkInData: {
          veteranData: {
            demographics: {
              firstName: 'first',
            },
          },
          appointments: [
            {
              appointmentIen: 'some-appointment-ien',
            },
            {
              appointmentIen: 'some-appointment-ien-2',
            },
          ],
        },
      };
      it('returns appointment and demographics data', () => {
        const selectVeteranData = makeSelectVeteranData();
        expect(selectVeteranData(state)).to.eql({
          demographics: {
            firstName: 'first',
          },
          appointments: [
            {
              appointmentIen: 'some-appointment-ien',
            },
            {
              appointmentIen: 'some-appointment-ien-2',
            },
          ],
        });
      });
    });
    describe('makeSelectSeeStaffMessage', () => {
      const state = {
        checkInData: {
          seeStaffMessage: 'Test message',
        },
      };
      it('returns see staff message', () => {
        const selectSeeStaffMessage = makeSelectSeeStaffMessage();
        expect(selectSeeStaffMessage(state)).to.eql({
          message: 'Test message',
        });
      });
    });
    describe('makeSelectApp', () => {
      const state = {
        checkInData: {
          app: 'preCheckIn',
        },
      };
      it('returns app name', () => {
        const selectApp = makeSelectApp();
        expect(selectApp(state)).to.eql({
          app: 'preCheckIn',
        });
      });
    });
    describe('makeSelectError', () => {
      const state = {
        checkInData: {
          error: 'max-validation',
        },
      };
      it('returns error string', () => {
        const selectError = makeSelectError();
        expect(selectError(state)).to.eql({
          error: 'max-validation',
        });
      });
    });
  });
});
