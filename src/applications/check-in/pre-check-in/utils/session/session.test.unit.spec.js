import { expect } from 'chai';
import sinon from 'sinon';
import { setCurrentToken, clearCurrentSession, getCurrentToken } from './index';

describe('Pre check in', () => {
  describe('session utils', () => {
    describe('save token to session storage', () => {
      it('saves data to name spaced key', () => {
        const setItem = sinon.spy();
        const window = {
          sessionStorage: {
            setItem,
          },
        };
        const testToken = 'testToken';
        setCurrentToken(window, testToken);
        expect(setItem.called).to.be.true;
        expect(
          setItem.calledWith(
            'health.care.check-in.current.uuid',
            JSON.stringify({ token: testToken }),
          ),
        ).to.be.true;
      });
    });
    describe('clears current session', () => {
      it('name-spaced session should be empty', () => {
        const removeItem = sinon.spy();
        const window = {
          sessionStorage: {
            removeItem,
          },
        };
        clearCurrentSession(window);
        expect(removeItem.called).to.be.true;
        expect(removeItem.calledWith('health.care.check-in.current.uuid')).to.be
          .true;
      });
    });
    describe('get token from session storage', () => {
      it('window is null', () => {
        const window = null;
        const result = getCurrentToken(window);
        expect(result).to.be.null;
      });
      it('calls getItem', () => {
        const getItem = sinon.spy();

        const window = {
          sessionStorage: {
            getItem,
          },
        };
        const result = getCurrentToken(window);
        expect(getItem.called).to.be.true;
        expect(getItem.calledWith('health.care.check-in.current.uuid')).to.be
          .true;
        expect(result).to.be.null;
      });
      it('key is not', () => {
        const window = {
          sessionStorage: {
            getItem: () => null,
          },
        };
        const result = getCurrentToken(window);
        expect(result).to.be.null;
      });
      it('key is found', () => {
        const window = {
          sessionStorage: {
            getItem: () => JSON.stringify({ token: 'some-token' }),
          },
        };
        const result = getCurrentToken(window);
        expect(result).to.have.property('token', 'some-token');
      });
    });
  });
});
