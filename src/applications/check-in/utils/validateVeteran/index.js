import i18next from 'i18next';
import { api } from '../../api';

/**
 * Validates auth fields and makes API request and routes.
 * @param {string} [lastName]
 * @param {object} [dob]
 * @param {boolean} [dobError]
 * @param {function} [setLastNameErrorMessage]
 * @param {function} [setIsLoading]
 * @param {function} [setShowValidateError]
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
  lastName,
  dob,
  dobError,
  setLastNameErrorMessage,
  setIsLoading,
  setShowValidateError,
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

  let valid = true;

  if (!lastName) {
    setLastNameErrorMessage(i18next.t('please-enter-your-last-name'));
    valid = false;
  }
  if (dobError || dob === '--') {
    valid = false;
  }
  // Use regex here to be able to validate when no error is present
  // doesnt match the web components validation completely the year can be any 4 digit number
  const regex = new RegExp(
    /[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))/,
  );
  if (!regex.test(dob)) {
    valid = false;
  }

  if (!valid) {
    return;
  }

  setIsLoading(true);
  try {
    const resp = await api.v2.postSession({
      token,
      dob,
      lastName,
      checkInType: app,
    });
    if (resp.errors || resp.error) {
      setIsLoading(false);
      updateError('session-error');
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
      let errorType = 'lorota-fail';
      if (e?.errors[0]?.status === '410' || isMaxValidateAttempts) {
        errorType = 'max-validation';
      }
      updateError(errorType);
    } else {
      setShowValidateError(true);
      if (!isLorotaDeletionEnabled) {
        incrementValidateAttempts(window);
      }
    }
  }
};

export { validateLogin };
