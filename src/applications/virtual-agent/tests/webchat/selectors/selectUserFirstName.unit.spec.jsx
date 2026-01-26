import { expect } from 'chai';
import selectUserFirstName from '../../../webchat/selectors/selectUserFirstName';

describe('selectUserFirstName', () => {
  it('should return first name from state', () => {
    const state = {
      user: {
        profile: {
          userFullName: {
            first: 'John',
          },
        },
      },
    };
    expect(selectUserFirstName(state)).to.equal('John');
  });
  it('should return first name from state with correct case when name is all uppercase', () => {
    const state = {
      user: {
        profile: {
          userFullName: {
            first: 'JOHN',
          },
        },
      },
    };
    expect(selectUserFirstName(state)).to.equal('John');
  });
  it('should return first name from state with correct case when name is all lowercase', () => {
    const state = {
      user: {
        profile: {
          userFullName: {
            first: 'john',
          },
        },
      },
    };
    expect(selectUserFirstName(state)).to.equal('John');
  });
});
