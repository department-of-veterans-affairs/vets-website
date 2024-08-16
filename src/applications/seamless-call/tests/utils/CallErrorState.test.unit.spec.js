import { expect } from 'chai';
import { callErrorStateDisplay } from '../../utils/CallErrorState';
import jssip from '../../utils/JsSipWrapper';

describe('CallErrorState', () => {
  describe('callErrorStateDisplay', () => {
    const { USER_DENIED_MEDIA_ACCESS, UNAVAILABLE, CANCELED } = jssip.C.causes;

    [
      [USER_DENIED_MEDIA_ACCESS, 'User denied media access'],
      [UNAVAILABLE, 'No answer'],
      [CANCELED, 'Call canceled'],
    ].forEach(([state, display]) => {
      it(`returns '${display}' given ${state}`, () => {
        expect(callErrorStateDisplay(state)).to.eq(display);
      });
    });

    it('throws an error given an unknown state', () => {
      expect(() => callErrorStateDisplay('UNKNOWN_STATE')).to.throw(
        'CallErrorState: unknown state: UNKNOWN_STATE',
      );
    });
  });
});
