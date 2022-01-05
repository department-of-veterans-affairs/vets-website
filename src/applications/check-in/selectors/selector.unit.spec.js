import { expect } from 'chai';

import {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
} from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectForm', () => {
      const state = {
        checkInData: {
          form: {
            pages: [],
            currentPage: '',
          },
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectForm();
        expect(selectFeatureToggles(state)).to.eql({
          pages: [],
          currentPage: '',
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
  });
});
