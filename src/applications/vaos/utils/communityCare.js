import { TYPES_OF_CARE } from './constants';
import { getFormData } from './selectors';

const ELIGIBLE_CODES = new Set(['H', 'N', 'G']);

export function isEligible(eligibility) {
  return (
    eligibility.eligibilities.some(item => ELIGIBLE_CODES.has(item.vceCode)) ||
    false
  );
}

export function isAllowedTypeOfCare(state) {
  const typeOfCareId = getFormData(state).typeOfCareId;

  return TYPES_OF_CARE.some(care => care.id === typeOfCareId);
}
