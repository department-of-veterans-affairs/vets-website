import { CLAIMANT_TYPES } from '../../constants';
import { MAX_LENGTH } from '../../../shared/constants';

import { getHomeless } from './homeless';
import { getAddress, getPhone, getEmail } from './veteran';
import {
  getTreatmentDate,
  hasDuplicateLocation,
  hasDuplicateFacility,
  getEvidence,
  getForm4142,
} from './evidence';
import { getMstData } from './mst';

/**
 * @typedef ClaimantData
 * @type {Object}
 * @property {String} claimantType - Phase 1 only supports "veteran"
 * @property {String} claimantTypeOtherValue - Populated if ClaimantType is "other"
 */
/**
 * Get claimant type data
 * @param {String} claimantType
 * @param {String} claimantTypeOtherValue
 * @returns ClaimantData
 */
export const getClaimantData = ({
  claimantType = '',
  claimantTypeOtherValue = '',
}) => {
  const result = {
    // Phase 1: No claimant type question, so we default to "veteran"
    claimantType: claimantType || CLAIMANT_TYPES[0],
  };

  if (result.claimantType === 'other' && claimantTypeOtherValue) {
    result.claimantTypeOtherValue = claimantTypeOtherValue.substring(
      0,
      MAX_LENGTH.SC_CLAIMANT_OTHER,
    );
  }
  return result;
};

export {
  getHomeless,
  getAddress,
  getPhone,
  getEmail,
  getTreatmentDate,
  hasDuplicateLocation,
  hasDuplicateFacility,
  getEvidence,
  getMstData,
  getForm4142,
};
