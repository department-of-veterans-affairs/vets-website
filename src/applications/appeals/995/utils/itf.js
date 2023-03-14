import moment from 'moment';

import { ITF_STATUSES, ITF_SUPPORTED_BENEFIT_TYPES } from '../constants';

// moment().isSameOrBefore() => true; so expirationDate can't be undefined
export const isNotExpired = (expirationDate = '') =>
  moment().isSameOrBefore(expirationDate);

export const isActiveITF = currentITF => {
  if (currentITF) {
    const isActive = currentITF.status === ITF_STATUSES.active;
    return isActive && isNotExpired(currentITF.expirationDate);
  }
  return false;
};

/**
 * Checks to see if the given pathname should be blocked from making any ITF
 * calls. Using includes because these shouldn't be repeated within this form
 * and it will allow search parameters, e.g. /introduction/?next=loginModal, etc
 */
const nonITFPages = [
  '/start',
  '/introduction',
  '/confirmation',
  '/form-saved',
  '/error',
  '/resume',
];
export const shouldBlockITF = pathname =>
  nonITFPages.some(noITFPath => pathname.includes(noITFPath));

/**
 * ITF only supports "compensation" and "pension", but the subtask includes
 * "pensionSurvivorsBenefits" and we're not sure if ITF supports it
 * @param {String} benefitType - benefit type from subtask (e.g. compensation)
 * @returns
 */
export const isSupportedBenefitType = benefitType =>
  ITF_SUPPORTED_BENEFIT_TYPES.some(
    supportedType => benefitType && supportedType.startsWith(benefitType),
  );
