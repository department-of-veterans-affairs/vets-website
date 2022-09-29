import i18next from 'i18next';
import { api } from '../../api';

/**
 * Validates auth fields and makes API request and routes.
 * @param {string} [last4Ssn]
 * @param {string} [lastName]
 * @param {object} [dob]
 * @param {boolean} [dobError]
 * @param {function} [setLastNameErrorMessage]
 * @param {function} [setLast4ErrorMessage]
 * @param {function} [setIsLoading]
 * @param {function} [setShowValidateError]
 * @param {boolean} [isLorotaSecurityUpdatesEnabled]
 * @param {function} [goToErrorPage]
 * @param {function} [goToNextPage]
 * @param {function} [incrementValidateAttempts]
 * @param {boolean} [isMaxValidateAttempts]
 * @param {string} [token]
 * @param {function} [setSession]
 * @param {string} [app]
 * @param {function} [resetAttempts]
 * @param {boolean} [isLorotaDeletionEnabled]
 * @param {function} [updateError]
 */

const validateLogin = async (
  last4Ssn,
  lastName,
  dob,
  dobError,
  setLastNameErrorMessage,
  setLast4ErrorMessage,
  setIsLoading,
  setShowValidateError,
  isLorotaSecurityUpdatesEnabled,
  goToErrorPage,
  goToNextPage,
  incrementValidateAttempts,
  isMaxValidateAttempts,
  token,
  setSession,
  app,
  resetAttempts,
  isLorotaDeletionEnabled,
  updateError,
) => {
  setLastNameErrorMessage();
  setLast4ErrorMessage();

  let valid = true;
  if (!isLorotaSecurityUpdatesEnabled) {
    if (!lastName) {
      setLastNameErrorMessage(i18next.t('please-enter-your-last-name'));
      valid = false;
    }
    if (!last4Ssn) {
      setLast4ErrorMessage(
        i18next.t(
          'please-enter-the-last-4-digits-of-your-social-security-number',
        ),
      );
      valid = false;
    }
  } else {
    if (!lastName) {
      setLastNameErrorMessage(i18next.t('please-enter-your-last-name'));
      valid = false;
    }
    if (dobError || dob === '--') {
      valid = false;
    }
  }

  if (!valid) {
    return;
  }

  setIsLoading(true);
  try {
    const resp = await api.v2.postSession({
      token,
      last4: last4Ssn,
      dob,
      lastName,
      checkInType: app,
      isLorotaSecurityUpdatesEnabled,
    });
    if (resp.errors || resp.error) {
      setIsLoading(false);
      goToErrorPage('?error=session-error');
    } else {
      setSession(token, resp.permissions);
      if (!isLorotaDeletionEnabled) {
        resetAttempts(window, token, true);
      }
      goToNextPage();
    }
  } catch (e) {
    setIsLoading(false);
    if (e?.errors[0]?.status !== '401' || isMaxValidateAttempts) {
      let params = '';
      if (e?.errors[0]?.status === '410' || isMaxValidateAttempts) {
        params = '?error=validation';
        updateError('max-validation');
      }
      goToErrorPage(params);
    } else {
      setShowValidateError(true);
      if (!isLorotaDeletionEnabled) {
        incrementValidateAttempts(window);
      }
    }
  }
};

export { validateLogin };
