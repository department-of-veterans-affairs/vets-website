import { expect } from 'chai';
import { MDOT_ERROR_CODES } from '../../constants';
import {
  showAlertDeceased,
  showAlertNoRecordForUser,
  showAlertNoSuppliesForReorder,
  showAlertReorderAccessExpired,
  showAlertSomethingWentWrong,
} from '../../selectors';

const stateFn = ({ formData = {}, error = false, loading = false } = {}) => ({
  mdotInProgressForm: {
    formData,
    error,
    loading,
  },
});

let result;
let state;

describe('showAlertDeceased', () => {
  it('returns true when error.code is MDOT_ERROR_CODES.DECEASED', () => {
    state = stateFn({ error: { code: MDOT_ERROR_CODES.DECEASED } });
    result = showAlertDeceased(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    expect(showAlertDeceased(stateFn())).to.eq(false);
    expect(showAlertDeceased({})).to.eq(false);
  });
});

describe('showAlertNoRecordForUser', () => {
  it('returns true when error.code is MDOT_ERROR_CODES.INVALID', () => {
    state = stateFn({ error: { code: MDOT_ERROR_CODES.INVALID } });
    result = showAlertNoRecordForUser(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    expect(showAlertNoRecordForUser(stateFn())).to.eq(false);
    expect(showAlertNoRecordForUser({})).to.eq(false);
  });
});

describe('showAlertNoSuppliesForReorder', () => {
  it('returns true when supply.availableForReorder prop is falsy for all supplies', () => {
    const supplies = [
      { productId: '123', availableForReorder: null },
      { productId: '456', availableForReorder: false },
      { productId: '789', availableForReorder: undefined },
      { productId: '101' },
    ];
    state = stateFn({ formData: { supplies } });
    result = showAlertNoSuppliesForReorder(state);
    expect(result).to.eq(true);
  });

  it('returns false when supplies are availableForReorder', () => {
    const supplies = [{ productId: '123', availableForReorder: true }];
    result = showAlertNoSuppliesForReorder(stateFn({ formData: { supplies } }));
    expect(result).to.eq(false);
  });

  it('returns false, otherwise', () => {
    expect(showAlertNoSuppliesForReorder(stateFn())).to.eq(false);
    expect(showAlertNoSuppliesForReorder({})).to.eq(false);
  });
});

describe('showAlertReorderAccessExpired', () => {
  it('returns true when error.code is MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND', () => {
    state = stateFn({ error: { code: MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND } });
    result = showAlertReorderAccessExpired(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    expect(showAlertReorderAccessExpired(stateFn())).to.eq(false);
    expect(showAlertReorderAccessExpired({})).to.eq(false);
  });
});

describe('showAlertSomethingWentWrong', () => {
  [500, 502, 503].forEach(status => {
    it(`returns true when error.status is ${status} (server error)`, () => {
      state = stateFn({ error: { status } });
      result = showAlertSomethingWentWrong(state);
      expect(result).to.eq(true);
    });
  });

  [401, 403, 404].forEach(status => {
    it(`returns false when error.status is ${status} (client error)`, () => {
      state = stateFn({ error: { status } });
      result = showAlertSomethingWentWrong(state);
      expect(result).to.eq(false);
    });
  });

  it('returns false, otherwise', () => {
    expect(showAlertSomethingWentWrong(stateFn())).to.eq(false);
    expect(showAlertSomethingWentWrong({})).to.eq(false);
  });
});
