import { expect } from 'chai';
import { showAlertUnregistered } from '../../selectors';

const stateFn = ({ loa = 3, vaPatient = true } = {}) => ({
  user: {
    profile: {
      loa: {
        current: loa,
      },
      vaPatient,
    },
  },
});

let result;
let state;

describe('showAlertUnregistered', () => {
  it('returns true when not LOA3', () => {
    state = stateFn({ loa: 1 });
    result = showAlertUnregistered(state);
    expect(result).to.eq(true);
  });

  it('returns true when not a VA patient', () => {
    state = stateFn({ vaPatient: false });
    result = showAlertUnregistered(state);
    expect(result).to.eq(true);
  });

  it('returns false when LOA3 and a VA patient', () => {
    state = stateFn();
    result = showAlertUnregistered(state);
    expect(result).to.eq(false);
  });
});
