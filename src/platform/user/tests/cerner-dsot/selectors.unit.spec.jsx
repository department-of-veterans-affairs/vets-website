import { expect } from 'chai';
import * as selectors from '../../cerner-dsot/selectors';

const drupalStaticData = {
  vamcEhrData: {
    data: {
      cernerFacilities: [
        {
          vhaId: '757',
          vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
          vamcSystemName: 'VA Central Ohio health care',
          ehr: 'cerner',
        },
        {
          vhaId: '687',
          vamcFacilityName: 'Jonathan M. Wainwright Memorial VA Medical Center',
          vamcSystemName: 'VA Walla Walla health care',
          ehr: 'cerner',
        },
      ],
    },
  },
};

describe('cerner-dsot user selectors', () => {
  describe('selectPatientFacilities', () => {
    it('returns null when there are no facilities on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectPatientFacilities(state)).to.be.null;
    });
    it('pulls out the state.profile.facilities array', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              { facilityId: '984', isCerner: false },
            ],
          },
        },
      };
      expect(selectors.selectPatientFacilities(state)).to.deep.equal(
        state.user.profile.facilities,
      );
    });
    it('pulls out state.profile.facilities and marks all isCerner:false when Cerner facilities not set on state', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '984' },
              { facilityId: '668' },
              { facilityId: '757' },
            ],
          },
        },
      };
      const expected = [
        { facilityId: '984', isCerner: false },
        { facilityId: '668', isCerner: false },
        { facilityId: '757', isCerner: false },
      ];
      expect(selectors.selectPatientFacilities(state)).to.deep.equal(expected);
    });
    it('pulls out state.profile.facilities and marks isCerner according to Cerner facilities data set on state', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '984' },
              { facilityId: '687' },
              { facilityId: '757' },
            ],
          },
        },
        drupalStaticData,
      };
      const expected = [
        { facilityId: '984', isCerner: false },
        {
          facilityId: '687',
          isCerner: true,
          usesCernerAppointments: true,
          usesCernerMedicalRecords: true,
          usesCernerMessaging: true,
          usesCernerRx: true,
          usesCernerTestResults: true,
        },
        {
          facilityId: '757',
          isCerner: true,
          usesCernerAppointments: true,
          usesCernerMedicalRecords: true,
          usesCernerMessaging: true,
          usesCernerRx: true,
          usesCernerTestResults: true,
        },
      ];
      expect(selectors.selectPatientFacilities(state)).to.deep.equal(expected);
    });
  });

  describe('selectPatientCernerFacilities', () => {
    it('returns empty array when Cerner facilities not set on state', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '984' },
              { facilityId: '687' },
              { facilityId: '757' },
            ],
          },
        },
      };
      expect(selectors.selectPatientCernerFacilities(state)).to.deep.equal([]);
    });
    it('pulls out patient facilities that are indicated as Cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '984' },
              { facilityId: '687' },
              { facilityId: '757' },
            ],
          },
        },
        drupalStaticData,
      };
      const expected = [
        {
          facilityId: '687',
          isCerner: true,
          usesCernerAppointments: true,
          usesCernerMedicalRecords: true,
          usesCernerMessaging: true,
          usesCernerRx: true,
          usesCernerTestResults: true,
        },
        {
          facilityId: '757',
          isCerner: true,
          usesCernerAppointments: true,
          usesCernerMedicalRecords: true,
          usesCernerMessaging: true,
          usesCernerRx: true,
          usesCernerTestResults: true,
        },
      ];
      expect(selectors.selectPatientCernerFacilities(state)).to.deep.equal(
        expected,
      );
    });
  });

  describe('selectIsCernerOnlyPatient', () => {
    it('returns true when all patient facilities are indicated as Cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '757' }, { facilityId: '687' }],
          },
        },
        drupalStaticData,
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).to.be.true;
    });
    it('returns false when at least one patient facility is not a Cerner facility', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '757' }, { facilityId: '123' }],
          },
        },
        drupalStaticData,
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).to.be.false;
    });
  });

  describe('selectIsCernerPatient', () => {
    it('returns true when single patient facility is indicated as a Cerner facility', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '757' }],
          },
        },
        drupalStaticData,
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.true;
    });
    it('returns true when at least one patient facility is indicated as a Cerner facility', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '757' }, { facilityId: '123' }],
          },
        },
        drupalStaticData,
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.true;
    });
    it('returns false when no patient facilities are indicated as Cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123' }, { facilityId: '124' }],
          },
        },
        drupalStaticData,
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.false;
    });
  });
});
