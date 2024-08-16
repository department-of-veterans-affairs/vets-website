import { expect } from 'chai';
import {
  CONNECTED,
  ENDED,
  FAILED,
  INITIATED,
  ACCEPTED_INVITE,
  CONFIRMED_INVITE,
  RINGING,
  SENDING_INVITE,
} from '../../constants';
import {
  callStateDisplay,
  isActive,
  isEnded,
  isInitiated,
  isInitializing,
  isFailed,
} from '../../utils/CallState';

describe('CallState', () => {
  describe('isInitiated', () => {
    it('returns true when the call state is INITIATED', () => {
      expect(isInitiated(INITIATED)).to.be.true;
    });

    it('returns false when the call state is not INITIATED', () => {
      expect(isInitiated(SENDING_INVITE)).to.be.false;
    });
  });

  describe('isInitializing', () => {
    [
      INITIATED,
      SENDING_INVITE,
      RINGING,
      ACCEPTED_INVITE,
      CONFIRMED_INVITE,
    ].forEach(state => {
      it(`returns true given ${state}`, () => {
        expect(isInitializing(state)).to.be.true;
      });
    });

    [ENDED, FAILED].forEach(state => {
      it(`returns false given ${state}`, () => {
        expect(isInitializing(state)).to.be.false;
      });
    });
  });

  describe('isActive', () => {
    it('returns true when the call state is CALL_CONNECTED', () => {
      expect(isActive(CONNECTED)).to.be.true;
    });

    it('returns false when the call state is not CALL_CONNECTED', () => {
      expect(isActive(INITIATED)).to.be.false;
    });
  });

  describe('isEnded', () => {
    it('returns true when the call state is CALL_ENDED', () => {
      expect(isEnded(ENDED)).to.be.true;
    });

    it('returns false when the call state is not CALL_ENDED', () => {
      expect(isEnded(INITIATED)).to.be.false;
    });
  });

  describe('isFailed', () => {
    it('returns true when the call state is CALL_FAILED', () => {
      expect(isFailed(FAILED)).to.be.true;
    });

    it('returns false when the call state is not CALL_FAILED', () => {
      expect(isFailed(INITIATED)).to.be.false;
    });
  });

  describe('callStateDisplay', () => {
    [
      [INITIATED, 'Calling ...'],
      [SENDING_INVITE, 'Calling ...'],
      [RINGING, 'Calling ...'],
      [ACCEPTED_INVITE, 'Calling ...'],
      [CONFIRMED_INVITE, 'Calling ...'],
      [CONNECTED, 'Connected'],
      [ENDED, 'Call ended'],
      [FAILED, 'Call failed'],
    ].forEach(([state, display]) => {
      it(`returns '${display}' given ${state}`, () => {
        expect(callStateDisplay(state)).to.eq(display);
      });
    });

    it('throws an error given an unknown state', () => {
      expect(() => callStateDisplay('UNKNOWN_STATE')).to.throw(
        'CallState: unknown state: UNKNOWN_STATE',
      );
    });
  });
});
