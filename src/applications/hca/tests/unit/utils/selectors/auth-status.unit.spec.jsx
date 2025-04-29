import { expect } from 'chai';
import { selectAuthStatus } from '../../../../utils/selectors';

describe('hca AuthStatus selectors', () => {
  const getData = ({ loa = null, loading = false }) => ({
    state: {
      user: {
        login: { currentlyLoggedIn: !!loa },
        profile: {
          loa: { current: loa, highest: loa },
          verified: !!loa,
          loading,
        },
      },
    },
  });

  it('should set the correct values when the user profile is loading', () => {
    const { state } = getData({ loading: true });
    const { isLoadingProfile } = selectAuthStatus(state);
    expect(isLoadingProfile).to.be.true;
  });

  it('should set the correct values when the user is logged out', () => {
    const { state } = getData({});
    const { isLoggedIn } = selectAuthStatus(state);
    expect(isLoggedIn).to.be.false;
  });

  it('should set the correct values when the user is logged in & LOA1', () => {
    const { state } = getData({ loa: 1 });
    const { isLoggedIn, isUserLOA1, isUserLOA3 } = selectAuthStatus(state);
    expect(isUserLOA3).to.be.false;
    expect(isUserLOA1).to.be.true;
    expect(isLoggedIn).to.be.true;
  });

  it('should set the correct values when the user is logged in & LOA3', () => {
    const { state } = getData({ loa: 3 });
    const { isLoggedIn, isUserLOA1, isUserLOA3 } = selectAuthStatus(state);
    expect(isUserLOA1).to.be.false;
    expect(isUserLOA3).to.be.true;
    expect(isLoggedIn).to.be.true;
  });
});
