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
    result = showAlertDeceased(stateFn());
    expect(result).to.eq(false);
  });
});

describe('showAlertNoRecordForUser', () => {
  it('returns true when error.code is MDOT_ERROR_CODES.INVALID', () => {
    state = stateFn({ error: { code: MDOT_ERROR_CODES.INVALID } });
    result = showAlertNoRecordForUser(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    result = showAlertNoRecordForUser(stateFn());
    expect(result).to.eq(false);
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

  it('returns false, otherwise', () => {
    const supplies = [{ productId: '123', availableForReorder: true }];
    result = showAlertNoSuppliesForReorder(stateFn({ formData: { supplies } }));
    expect(result).to.eq(false);
  });
});

describe('showAlertReorderAccessExpired', () => {
  it('returns true when error.code is MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND', () => {
    state = stateFn({ error: { code: MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND } });
    result = showAlertReorderAccessExpired(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    result = showAlertReorderAccessExpired(stateFn());
    expect(result).to.eq(false);
  });
});

describe('showAlertSomethingWentWrong', () => {
  it('returns true when error.status is 500', () => {
    state = stateFn({ error: { status: 500 } });
    result = showAlertSomethingWentWrong(state);
    expect(result).to.eq(true);
  });

  it('returns true when error.status is 503', () => {
    state = stateFn({ error: { status: 503 } });
    result = showAlertSomethingWentWrong(state);
    expect(result).to.eq(true);
  });

  it('returns false, otherwise', () => {
    result = showAlertSomethingWentWrong(stateFn());
    expect(result).to.eq(false);
  });
});
