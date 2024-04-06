import {
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_SAVE_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
  DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
  DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
} from '@@profile/actions/directDeposit';

/**
@typedef {Object} ControlInformation
@property {boolean} [canUpdateDirectDeposit] - User can update direct deposit information.
@property {boolean} [isCorpAvailable] - Corporate database is available for compensations and benefits
@property {boolean} [isEduClaimAvailable] - Education claim is available for CH33 benefits.
@property {boolean} [isCorpRecFound] - Corporate record is found.
@property {boolean} [hasNoBdnPayments] - No BDN payments.
@property {boolean} [hasIdentity] - User's identity is verified.
@property {boolean} [hasIndex] - User has an index.
@property {boolean} [isCompetent] - User is competent.
@property {boolean} [hasMailingAddress] - User has a mailing address.
@property {boolean} [hasNoFiduciaryAssigned] - No fiduciary assigned to the user.
@property {boolean} [isNotDeceased] - User is not deceased.
@property {boolean} [hasPaymentAddress] - User has a payment address.
*/

/**
@typedef {Object} DirectDepositState
@property {ControlInformation|null} controlInformation - Control information for direct deposit access.
@property {Object|null} paymentAccount - Payment account information.
@property {string} [paymentAccount.name] - Bank name associated with the payment account.
@property {string} [paymentAccount.accountType] - Type of the payment account (checking or savings).
@property {string} [paymentAccount.accountNumber] - Account number of the payment account redacted to last 4 digits.
@property {string} [paymentAccount.routingNumber] - Routing number of the payment account redacted to last 4 digits.
@property {Object|null} loadError - Error object for loading direct deposit information response.
@property {Object|null} saveError - Error object for saving direct deposit information response.
@property {Object} ui - UI-related state for direct deposit.
@property {boolean} ui.isEditing - Direct deposit form is being edited.
@property {boolean} ui.isSaving - Direct deposit form is being saved.
*/

/**
 * @type {DirectDepositState}
 */
const initialState = {
  controlInformation: null,
  paymentAccount: null,
  loadError: null,
  saveError: null,
  ui: {
    isEditing: false,
    isSaving: false,
  },
};

/**
 * ## directDeposit reducer
 * ![Dealing with redux](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTRqNG42Y2wxcGJkZDk4dzI5bDlwdjVzN2k0cnBoa2djanJjaXIybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/108KUzjTMEp2gw/giphy-downsized.gif)
 *
 * - the best switch statement you've ever seen
 * - ALL CAPS ALL THE TIME
 * - no side effects
 *
 * ---
 *
 *  _"I'm not a side effect, I'm a feature!"_ - this code ⛺
 *
 * ---
 *
 *
 * @param {DirectDepositState} state
 * @param {Object} action
 * @returns {DirectDepositState} direct deposit state
 *
 */
function directDeposit(state = initialState, action) {
  switch (action.type) {
    case DIRECT_DEPOSIT_FETCH_SUCCEEDED:
    case DIRECT_DEPOSIT_SAVE_SUCCEEDED: {
      return {
        controlInformation: action.response?.controlInformation ?? null,
        paymentAccount: action.response?.paymentAccount ?? null,
        loadError: null,
        saveError: null,
        ui: {
          isEditing: false,
          isSaving: false,
        },
      };
    }

    case DIRECT_DEPOSIT_FETCH_FAILED: {
      return {
        ...state,
        loadError: action.response?.error ?? true,
        saveError: null,
      };
    }

    case DIRECT_DEPOSIT_EDIT_TOGGLED: {
      return {
        ...state,
        saveError: null,
        ui: {
          ...state.ui,
          isEditing: action.open ?? !state.ui.isEditing,
        },
      };
    }

    case DIRECT_DEPOSIT_LOAD_ERROR_CLEARED: {
      return {
        ...state,
        saveError: null,
      };
    }

    case DIRECT_DEPOSIT_SAVE_ERROR_CLEARED: {
      return {
        ...state,
        loadError: null,
      };
    }

    case DIRECT_DEPOSIT_SAVE_STARTED: {
      return {
        ...state,
        saveError: null,
        ui: {
          ...state.ui,
          isSaving: true,
        },
      };
    }

    case DIRECT_DEPOSIT_SAVE_FAILED: {
      return {
        ...state,
        saveError: action.response?.error ?? action.response?.errors ?? true,
        ui: {
          ...state.ui,
          isSaving: false,
        },
      };
    }

    default:
      return state;
  }
}

export default directDeposit;
