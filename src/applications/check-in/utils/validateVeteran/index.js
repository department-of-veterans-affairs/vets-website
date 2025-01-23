import { api } from '../../api';
import { APP_NAMES } from '../appConstants';

/**
 * Validates auth fields and makes API request and routes.
 * @param {string} [lastName]
 * @param {object} [dob]
 * @param {boolean} [dobError]
 * @param {boolean} [setLastNameError]
 * @param {function} [setIsLoading]
 * @param {function} [setShowValidateError]
 * @param {function} [goToNextPage]
 * @param {string} [token]
 * @param {function} [setSession]
 * @param {string} [app]
 * @param {function} [updateError]
 */

const validateLogin = async (
  lastName,
  dob,
  dobError,
  setLastNameError,
  setIsLoading,
  setShowValidateError,
  goToNextPage,
  token,
  setSession,
  app,
  updateError,
  setDobError,
) => {
  setLastNameError(false);

  let valid = true;

  if (!lastName) {
    setLastNameError(true);
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
    setDobError(true);
    return;
  }

  setIsLoading(true);
  try {
    const resp = await api.v2.postSession({
      token,
      dob,
      lastName,
      checkInType: app,
      facilityType: app === APP_NAMES.TRAVEL_CLAIM ? 'oh' : '',
    });
    if (resp.errors || resp.error) {
      setIsLoading(false);
      updateError('session-error');
    } else {
      setSession(token, resp.permissions);
      goToNextPage();
    }
  } catch (e) {
    setIsLoading(false);
    if (e.errors && e.errors[0]?.status !== '401') {
      let errorType = 'lorota-fail';
      if (e.errors && e.errors[0]?.status === '404') {
        errorType = 'uuid-not-found';
      }
      if (e.errors && e.errors[0]?.status === '410') {
        errorType = 'max-validation';
      }
      updateError(errorType);
    } else {
      setShowValidateError(true);
    }
  }
};

export { validateLogin };
