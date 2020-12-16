import { expect } from 'chai';

import {
  selectIsWelcomeModalDismissed,
  selectIsCernerOnlyPatient,
  selectUseFlatFacilityPage,
} from '../../redux/selectors';

describe('VAOS selectors', () => {
  describe('selectIsWelcomeModalDismissed', () => {
    it('should return dismissed if key is in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-vaos'],
        },
      };
      expect(selectIsWelcomeModalDismissed(state)).to.be.true;
    });
    it('should not return dismissed if key is not in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-va'],
        },
      };
      expect(selectIsWelcomeModalDismissed(state)).to.be.false;
    });
  });

  describe('selectIsCernerOnlyPatient', () => {
    it('should return true if Cerner only', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
                usesCernerAppointments: true,
              },
            ],
          },
          isCernerPatient: true,
        },
      };
      expect(selectIsCernerOnlyPatient(state)).to.be.true;
    });
    it('should return false if not Cerner only', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
                usesCernerAppointments: true,
              },
              { facilityId: '124', isCerner: false },
            ],
            isCernerPatient: true,
          },
        },
      };
      expect(selectIsCernerOnlyPatient(state)).to.be.false;
    });
  });

  describe('selectUseFlatFacilityPage', () => {
    it('should return true if feature toggle is on and user is not cerner patient', () => {
      const state = {
        featureToggles: {
          vaOnlineSchedulingFlatFacilityPage: true,
        },
      };

      expect(selectUseFlatFacilityPage(state)).to.be.true;
    });

    it('should return false if feature toggle is off', () => {
      const state = {
        featureToggles: {
          vaOnlineSchedulingFlatFacilityPage: false,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '124', isCerner: false }],
          },
        },
      };

      expect(selectUseFlatFacilityPage(state)).to.be.false;
    });

    it('should return false if feature toggle is on and user has cerner facilities', () => {
      const state = {
        featureToggles: {
          vaOnlineSchedulingFlatFacilityPage: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
                usesCernerAppointments: true,
              },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };

      expect(selectUseFlatFacilityPage(state)).to.be.false;
    });

    it('should return false if feature toggle is on and user is registered to Sacramento VA', () => {
      const state = {
        featureToggles: {
          vaOnlineSchedulingFlatFacilityPage: true,
          vaOnlineSchedulingFlatFacilityPageSacramento: false,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              { facilityId: '612', isCerner: false },
            ],
          },
        },
      };

      expect(selectUseFlatFacilityPage(state)).to.be.false;
    });
  });

  it('should return false if feature toggle is on and user is registered to Sacramento VA and has cerner facilities', () => {
    const state = {
      featureToggles: {
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingFlatFacilityPageSacramento: false,
      },
      user: {
        profile: {
          facilities: [
            {
              facilityId: '668',
              isCerner: true,
              usesCernerAppointments: true,
            },
            { facilityId: '612', isCerner: false },
          ],
        },
      },
    };

    expect(selectUseFlatFacilityPage(state)).to.be.false;
  });

  it('should return true if feature toggle is on and user is registered to Sacramento VA and flat page is enabled for Sacramento', () => {
    const state = {
      featureToggles: {
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingFlatFacilityPageSacramento: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '612', isCerner: false }],
        },
      },
    };

    expect(selectUseFlatFacilityPage(state)).to.be.true;
  });
});
