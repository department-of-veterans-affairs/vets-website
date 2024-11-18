import { signInServiceEnabled } from '~/platform/user/authentication/selectors';

import { isLOA3, isLoggedIn, isVAPatient } from '~/platform/user/selectors';

import { MDOT_ERROR_CODES } from '../constants';

const canReorderOn = state =>
  state?.mdotInProgressForm?.formData?.supplies
    ?.map(s => s?.nextAvailabilityDate)
    ?.sort()
    ?.at(0);

const showAlertDeceased = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.DECEASED || false;

const showAlertNoRecordForUser = state =>
  state?.mdotInProgressForm?.error?.code === MDOT_ERROR_CODES.INVALID || false;

const showAlertNoSuppliesForReorder = state =>
  state?.mdotInProgressForm?.formData?.supplies?.every(
    supply => supply?.availableForReorder === undefined,
  ) || false;

const showAlertReorderAccessExpired = state =>
  state?.mdotInProgressForm?.error?.code ===
    MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND || false;

const showAlertSomethingWentWrong = state =>
  Math.trunc(+state?.mdotInProgressForm?.error?.status / 500) === 1;

export {
  canReorderOn,
  isLOA3,
  isLoggedIn,
  isVAPatient,
  signInServiceEnabled,
  showAlertDeceased,
  showAlertNoRecordForUser,
  showAlertNoSuppliesForReorder,
  showAlertReorderAccessExpired,
  showAlertSomethingWentWrong,
};
