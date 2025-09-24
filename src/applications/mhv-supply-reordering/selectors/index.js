import { signInServiceEnabled } from '~/platform/user/authentication/selectors';

import { isLOA3, isLoggedIn, isVAPatient } from '~/platform/user/selectors';

import { MDOT_ERROR_CODES } from '../constants';

const selectSupplies = state =>
  state?.mdotInProgressForm?.formData?.supplies?.filter(
    s => !!s?.availableForReorder,
  ) || [];

const selectUnavailableSupplies = state =>
  state?.mdotInProgressForm?.formData?.supplies?.filter(
    s => !s?.availableForReorder,
  ) || [];

const canReorderOn = state =>
  selectUnavailableSupplies(state)
    ?.map(s => s?.nextAvailabilityDate)
    ?.sort()
    ?.at(0);

const showAlertDeceased = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.DECEASED || false;

const showAlertNoRecordForUser = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.INVALID || false;

const showAlertNoSuppliesForReorder = state =>
  state?.mdotInProgressForm?.formData?.supplies?.every(
    supply => !supply?.availableForReorder,
  ) || false;

const showAlertReorderAccessExpired = state =>
  state?.mdotInProgressForm?.error?.code ===
    MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND || false;

const showAlertServerError = state =>
  Math.trunc(+state?.mdotInProgressForm?.error?.status / 500) === 1;

const isAlerting = state =>
  showAlertDeceased(state) ||
  showAlertNoRecordForUser(state) ||
  showAlertNoSuppliesForReorder(state) ||
  showAlertReorderAccessExpired(state) ||
  showAlertServerError(state);

export {
  canReorderOn,
  isAlerting,
  isLOA3,
  isLoggedIn,
  isVAPatient,
  selectSupplies,
  selectUnavailableSupplies,
  signInServiceEnabled,
  showAlertDeceased,
  showAlertNoRecordForUser,
  showAlertNoSuppliesForReorder,
  showAlertReorderAccessExpired,
  showAlertServerError,
};
