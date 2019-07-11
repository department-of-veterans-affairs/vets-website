// Not entirely sure if this is needed. Adding in here just in case we want to
// leverage this functionality.
import profileInformation from '../../../../platform/user/profile/reducers';

import {
  LOADING_CONNECTED_ACCOUNTS,
  FINISHED_CONNECTED_ACCOUNTS,
  ERROR_CONNECTED_ACCOUNTS,
  DELETING_CONNECTED_ACCOUNT,
  ERROR_DELETING_CONNECTED_ACCOUNT,
  FINISHED_DELETING_CONNECTED_ACCOUNT,
  DELETED_ACCOUNT_ALERT_DISMISSED,
} from '../actions';

const initialState = {
  accounts: [],
  loading: false,
  errors: [],
};

function connectedAccounts(state = initialState, action) {
  switch (action.type) {
    case LOADING_CONNECTED_ACCOUNTS:
      return { ...state, loading: true };
    case FINISHED_CONNECTED_ACCOUNTS:
      return { ...state, accounts: action.data, loading: false, errors: [] };
    case ERROR_CONNECTED_ACCOUNTS:
      return { ...state, loading: false, errors: action.errors };
    case DELETING_CONNECTED_ACCOUNT: {
      const accounts = state.accounts.map(account => {
        if (account.id === action.accountId) {
          return { ...account, deleting: true };
        }
        return account;
      });
      return { ...state, accounts };
    }
    case ERROR_DELETING_CONNECTED_ACCOUNT: {
      const accounts = state.accounts.map(account => {
        if (account.id === action.accountId) {
          return { ...account, deleting: false, errors: action.errors };
        }
        return account;
      });
      return { ...state, accounts };
    }
    case FINISHED_DELETING_CONNECTED_ACCOUNT: {
      const accounts = state.accounts.map(account => {
        if (account.id === action.accountId) {
          return { ...account, deleting: false, deleted: true };
        }
        return account;
      });
      return { ...state, accounts };
    }
    case DELETED_ACCOUNT_ALERT_DISMISSED: {
      const accounts = state.accounts.filter(
        account => account.id !== action.accountId,
      );
      return { ...state, accounts };
    }
    default:
      return state;
  }
}

export default {
  connectedAccounts,
  account: profileInformation,
};
