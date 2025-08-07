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

  it('should select user facility', () => {
    expect(selectUserFacility(mockState)).to.deep.equal({
      id: '123',
      name: 'VA Medical Center',
    });
  });
});
