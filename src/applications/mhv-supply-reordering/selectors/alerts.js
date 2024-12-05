import { MDOT_ERROR_CODES } from '../constants';

export const showAlertDeceased = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.DECEASED || false;

export const showAlertNoRecordForUser = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.INVALID || false;

export const showAlertNoSuppliesForReorder = state =>
  state?.mdotInProgressForm?.formData?.supplies?.every(
    supply => !supply?.availableForReorder,
  ) || false;

export const showAlertReorderAccessExpired = state =>
  state?.mdotInProgressForm?.error?.code ===
    MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND || false;

export const showAlertSomethingWentWrong = state =>
  Math.trunc(+state?.mdotInProgressForm?.error?.status / 500) === 1;

export const isAlerting = state =>
  showAlertDeceased(state) ||
  showAlertNoRecordForUser(state) ||
  showAlertReorderAccessExpired(state) ||
  showAlertSomethingWentWrong(state) ||
  showAlertNoSuppliesForReorder(state);
