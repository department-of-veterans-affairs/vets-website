import { expect } from 'chai';
import { selectAuthStatus } from '../../../../utils/selectors/auth-status';

describe('ezr auth status selectors', () => {
  describe('when `selectAuthStatus` executes', () => {
    context('when the user profile is loading', () => {
      it('should set the correct part of the state', () => {
        const state = {
          user: {
            login: { currentlyLoggedIn: false },
            profile: {
              loa: { current: null, highest: null },
              verified: false,
              loading: true,
            },
          },
        };
        const { isLoggedOut, isUserLOA3 } = selectAuthStatus(state);
        expect(isLoggedOut).to.be.false;
        expect(isUserLOA3).to.be.false;
      });
    });

    context('when the user is logged out', () => {
      it('should set the correct part of the state', () => {
        const state = {
          user: {
            login: { currentlyLoggedIn: false },
            profile: {
              loa: { current: null, highest: null },
              verified: false,
              loading: false,
            },
          },
        };
        const { isLoggedOut, isUserLOA3 } = selectAuthStatus(state);
        expect(isLoggedOut).to.be.true;
        expect(isUserLOA3).to.be.false;
      });
    });

    context('when the user is logged in', () => {
      context('when the user is LOA1', () => {
        it('should set the correct part of the state', () => {
          const state = {
            user: {
              login: { currentlyLoggedIn: true },
              profile: {
                loa: { current: 1, highest: 1 },
                verified: true,
                loading: false,
              },
            },
          };
          const { isLoggedOut, isUserLOA1, isUserLOA3 } = selectAuthStatus(
            state,
          );
          expect(isLoggedOut).to.be.false;
          expect(isUserLOA3).to.be.false;
          expect(isUserLOA1).to.be.true;
        });
      });

      context('when the user is LOA3', () => {
        it('should set the correct part of the state', () => {
          const state = {
            user: {
              login: { currentlyLoggedIn: true },
              profile: {
                loa: { current: 3, highest: 3 },
                verified: true,
                loading: false,
                status: 'OK',
              },
            },
          };
          const { isLoggedOut, isUserLOA1, isUserLOA3 } = selectAuthStatus(
            state,
          );
          expect(isLoggedOut).to.be.false;
          expect(isUserLOA3).to.be.true;
          expect(isUserLOA1).to.be.false;
        });
      });
    });
  });
});
