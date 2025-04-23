import { expect } from 'chai';
import {
  mhvAccountStatusUsersuccess,
  mhvAccountStatusErrorsSorted,
  mhvAccountStatusUserError,
} from '../../selectors';
import { accountStatusMultiError } from '../../mocks/api/user/mhvAccountStatus';

describe('mhvAccountStatusUsersuccess', () => {
  it('returns false when loading', () => {
    const loadingState = {
      myHealth: {
        accountStatus: {
          loading: true,
        },
      },
    };
    const result = mhvAccountStatusUsersuccess(loadingState);
    expect(result).to.be.false;
  });

  it('returns false when errors', () => {
    const errorState = {
      myHealth: {
        accountStatus: {
          data: {
            errors: [
              {
                title: 'The server responded with status 422',
                detail: 'things fall apart',
                code: 801,
              },
            ],
          },
        },
      },
    };
    const result = mhvAccountStatusUsersuccess(errorState);
    expect(result).to.be.false;
  });

  it('returns true not loading and no errors', () => {
    const state = {
      myHealth: {
        accountStatus: {
          data: {},
        },
      },
    };
    const result = mhvAccountStatusUsersuccess(state);
    expect(result).to.be.true;
  });
});

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
