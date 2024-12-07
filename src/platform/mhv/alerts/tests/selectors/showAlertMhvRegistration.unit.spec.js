import { expect } from 'chai';
import { showAlertMhvRegistration } from '../../selectors';

const stateFn = ({
  loa = 3,
  mhvAccountState = 'NONE',
  vaPatient = true,
} = {}) => ({
  user: {
    profile: {
      loa: {
        current: loa,
      },
      mhvAccountState,
      vaPatient,
    },
  },
});

let result;
let state;

describe('showAlertMhvRegistration', () => {
  it('returns true when LOA3, is a VA Patient, and no MHV account', () => {
    state = stateFn();
    result = showAlertMhvRegistration(state);
    expect(result).to.eq(true);
  });

  it('returns false', () => {
    result = showAlertMhvRegistration(stateFn({ loa: 1 }));
    expect(result).to.eq(false);

    result = showAlertMhvRegistration(stateFn({ vaPatient: false }));
    expect(result).to.eq(false);

    result = showAlertMhvRegistration(stateFn({ mhvAccountState: 'OK' }));
    expect(result).to.eq(false);
  });
});
