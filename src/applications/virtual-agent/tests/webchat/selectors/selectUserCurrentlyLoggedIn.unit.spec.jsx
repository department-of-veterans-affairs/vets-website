import { expect } from 'chai';
import selectUserCurrentlyLoggedIn from '../../../webchat/selectors/selectUserCurrentlyLoggedIn';

describe('selectUserCurrentlyLoggedIn', () => {
  it('should return false when user is logged out', () => {
    const state = {
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    };
    expect(selectUserCurrentlyLoggedIn(state)).to.be.false;
  });
  it('should return true when user is logged in', () => {
    const state = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };
    expect(selectUserCurrentlyLoggedIn(state)).to.be.true;
  });
});
