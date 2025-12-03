import Cookies from 'js-cookie';
import { isBefore } from 'date-fns';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

const COOKIE_NAME = 'MHV_EMAIL_CONFIRMATION_DISMISSED';

const dismissedAlertViaCookie = () => Cookies.get(COOKIE_NAME);
export const dismissAlertViaCookie = () =>
  Cookies.set(COOKIE_NAME, 'true', { expires: 365 });
export const resetDismissAlertViaCookie = () => Cookies.remove(COOKIE_NAME);

const selectContactEmailConfirmationDate = state =>
  selectVAPContactInfo(state)?.email?.confirmationDate;

const selectContactEmailUpdatedAt = state =>
  selectVAPContactInfo(state)?.email?.updatedAt;

export const selectContactEmailAddress = state =>
  selectVAPContactInfo(state)?.email?.emailAddress;

export const selectContactEmailAddressId = state =>
  selectVAPContactInfo(state)?.email?.id;

export const DATE_THRESHOLD = '2025-03-01T12:00:00.000+00:00';

export const showAlert = state =>
  !dismissedAlertViaCookie() &&
  !state.featureToggles.loading &&
  state.featureToggles.mhvEmailConfirmation &&
  !state.user.profile.loading &&
  state.user.profile.vaPatient &&
  (!selectContactEmailAddress(state) ||
    !selectContactEmailConfirmationDate(state) ||
    isBefore(
      new Date(selectContactEmailConfirmationDate(state)),
      new Date(DATE_THRESHOLD),
    ) ||
    !selectContactEmailUpdatedAt(state) ||
    isBefore(
      new Date(selectContactEmailUpdatedAt(state)),
      new Date(DATE_THRESHOLD),
    ));
