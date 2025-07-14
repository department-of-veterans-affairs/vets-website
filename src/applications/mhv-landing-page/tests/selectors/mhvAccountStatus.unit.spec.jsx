import { expect } from 'chai';
import {
  mhvAccountStatusErrorsSorted,
  mhvAccountStatusUserError,
} from '../../selectors';
import { accountStatusMultiError } from '../../mocks/api/user/mhvAccountStatus';

describe('mhvAccountStatusErrorsSorted', () => {
  it('prioritizes user errors', () => {
    const state = {
      myHealth: {
        accountStatus: {
          data: accountStatusMultiError,
        },
      },
    };
    const result = mhvAccountStatusErrorsSorted(state);
    expect(result[0].code).to.eq(805);
  });
});

describe('mhvAccountStatusUserError', () => {
  it('returns user error code', () => {
    const state = {
      myHealth: {
        accountStatus: {
          data: accountStatusMultiError,
        },
      },
    };
    const result = mhvAccountStatusUserError(state);
    expect(result[0].code).to.eq(805);
  });
});
