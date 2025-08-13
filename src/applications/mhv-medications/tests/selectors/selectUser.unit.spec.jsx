import { expect } from 'chai';
import {
  selectUserDob,
  selectUserFullName,
  selectUserFacility,
} from '../../selectors/selectUser';

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
      const facilities = [{ id: '123', name: 'Test VA Facility' }];
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
});
