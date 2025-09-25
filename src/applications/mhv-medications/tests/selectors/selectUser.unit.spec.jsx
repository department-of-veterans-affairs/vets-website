import { expect } from 'chai';
import {
  selectUserDob,
  selectUserFullName,
  selectUserFacility,
  selectHasMedsByMailFacility,
} from '../../selectors/selectUser';
import { MEDS_BY_MAIL_FACILITY_ID } from '../../util/constants';

describe('mhv-medications selectors: selectUser', () => {
  const mockState = {
    user: {
      profile: {
        dob: '1980-01-01',
        userFullName: {
          first: 'Jane',
          middle: 'Q',
          last: 'Veteran',
          suffix: 'Sr.',
        },
        facility: {
          id: '123',
          name: 'VA Medical Center',
        },
      },
    },
  };

  it('should select user dob', () => {
    expect(selectUserDob(mockState)).to.equal('1980-01-01');
  });

  it('should select user full name', () => {
    expect(selectUserFullName(mockState)).to.deep.equal({
      first: 'Jane',
      middle: 'Q',
      last: 'Veteran',
      suffix: 'Sr.',
    });
  });

  describe('selectUserFacility', () => {
    it('should select user facility', () => {
      const facilities = [{ facilityId: '123', name: 'Test VA Facility' }];
      const state = {
        user: {
          profile: {
            facilities,
          },
        },
      };
      expect(selectUserFacility(state)).to.deep.equal(facilities);
    });

    it('should return undefined if user is missing', () => {
      const state = {};
      expect(selectUserFacility(state)).to.be.undefined;
    });

    it('should return undefined if profile is missing', () => {
      const state = { user: {} };
      expect(selectUserFacility(state)).to.be.undefined;
    });

    it('should return undefined if facilities is missing', () => {
      const state = { user: { profile: {} } };
      expect(selectUserFacility(state)).to.be.undefined;
    });
  });

  describe('selectHasMedsByMailFacility', () => {
    it('should return true if the meds by mail facility ID is present', () => {
      const facilities = [
        { facilityId: MEDS_BY_MAIL_FACILITY_ID, name: 'Meds by Mail Facility' },
      ];
      const state = {
        user: {
          profile: {
            facilities,
          },
        },
      };
      expect(selectHasMedsByMailFacility(state)).to.be.true;
    });

    it('should return false if the meds by mail facility ID is not present', () => {
      const facilities = [{ facilityId: '123', name: 'Test VA Facility' }];
      const state = {
        user: {
          profile: {
            facilities,
          },
        },
      };
      expect(selectHasMedsByMailFacility(state)).to.be.false;
    });

    it('should return false if user is missing', () => {
      const state = {};
      expect(selectHasMedsByMailFacility(state)).to.be.false;
    });

    it('should return false if profile is missing', () => {
      const state = { user: {} };
      expect(selectHasMedsByMailFacility(state)).to.be.false;
    });

    it('should return false if facilities is missing', () => {
      const state = { user: { profile: {} } };
      expect(selectHasMedsByMailFacility(state)).to.be.false;
    });

    it('should return false if facilities is empty', () => {
      const state = { user: { profile: { facilities: [] } } };
      expect(selectHasMedsByMailFacility(state)).to.be.false;
    });
  });
});
