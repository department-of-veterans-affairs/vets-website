import { expect } from 'chai';

import {
  makeSelectCurrentContext,
  makeSelectFeatureToggles,
  makeSelectForm,
  makeSelectVeteranData,
} from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectFeatureToggles', () => {
      const state = {
        featureToggles: {
          loading: false,
          /* eslint-disable camelcase */
          check_in_experience_pre_check_in_enabled: true,
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles({});
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isPreCheckInEnabled: true,
        });
      });
    });
    describe('makeSelectForm', () => {
      const state = {
        preCheckInData: {
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
        preCheckInData: {
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
        preCheckInData: {
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
