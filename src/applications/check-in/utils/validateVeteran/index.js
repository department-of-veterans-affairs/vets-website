import isAfter from 'date-fns/isAfter';
import i18next from 'i18next';
import { api } from '../../api';
import { extractDateFromVaDateComponent } from '../formatters';

/**
 * Validates auth fields and makes API request and routes.
 * @param {string} [last4Ssn]
 * @param {string} [lastName]
 * @param {object} [dob]
 * @param {boolean} [showValidateError]
 * @param {function} [setLastNameErrorMessage]
 * @param {function} [setLast4ErrorMessage]
 * @param {function} [setDobErrorMessage]
 * @param {function} [setDob]
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
 */

const validateLogin = async (
  last4Ssn,
  lastName,
  dob,
  showValidateError,
  setLastNameErrorMessage,
  setLast4ErrorMessage,
  setDobErrorMessage,
  setDob,
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
) => {
  setLastNameErrorMessage();
  setLast4ErrorMessage();
  setDobErrorMessage();

  let valid = true;
  const { year, month, day } = dob;
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
    if (!year.value || !month.value || !day.value) {
      setDobErrorMessage(i18next.t('please-provide-a-response'));
      setDob(prevState => ({
        year: { ...prevState.year, dirty: true },
        day: { ...prevState.day, dirty: true },
        month: { ...prevState.month, dirty: true },
      }));
      valid = false;
    } else if (isAfter(new Date(year.value), new Date())) {
      setDobErrorMessage(
        i18next.t('your-date-of-birth-can-not-be-in-the-future'),
      );
      setDob(prevState => ({
        year: { ...prevState.year, dirty: true },
        day: { ...prevState.day, dirty: true },
        month: { ...prevState.month, dirty: true },
      }));
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
      dob: extractDateFromVaDateComponent(dob),
      lastName,
      checkInType: app,
      isLorotaSecurityUpdatesEnabled,
    });
    if (resp.errors || resp.error) {
      setIsLoading(false);
      goToErrorPage();
    } else {
      setSession(token, resp.permissions);
      goToNextPage();
    }
  } catch (e) {
    setIsLoading(false);
    if (e?.errors[0]?.status !== '401' || isMaxValidateAttempts) {
      goToErrorPage();
    } else {
      if (!showValidateError) {
        setShowValidateError(true);
      }
      incrementValidateAttempts(window);
    }
  }
};

export { validateLogin };
