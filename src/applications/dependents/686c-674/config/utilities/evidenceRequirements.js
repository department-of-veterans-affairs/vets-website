import { MARRIAGE_TYPES } from '../constants';

/**
 * Get spouse evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - spouse evidence requirements
 */
export const spouseEvidence = (formData = {}) => {
  const { veteranAddress } = formData.veteranContactInformation || {};
  const isOutsideUSA =
    veteranAddress?.country !== 'USA' || Boolean(veteranAddress?.isMilitary);

  const { typeOfMarriage } = formData.currentMarriageInformation || {};
  const isCommonLawMarriage = typeOfMarriage === MARRIAGE_TYPES.commonLaw;
  const isTribalMarriage = typeOfMarriage === MARRIAGE_TYPES.tribal;
  const isProxyMarriage = typeOfMarriage === MARRIAGE_TYPES.proxy;
  const needsSpouseUpload =
    typeof typeOfMarriage === 'string' &&
    typeOfMarriage !== MARRIAGE_TYPES.ceremonial;

  return {
    isCommonLawMarriage,
    isTribalMarriage,
    isProxyMarriage,
    isOutsideUSA,
    needsSpouseUpload,
  };
};

/**
 * Get child evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - child evidence requirements
 */
export const childEvidence = (formData = {}) => {
  const veteranAddress =
    formData?.veteranContactInformation?.veteranAddress || {};
  const livesOutsideUSA =
    veteranAddress.country !== 'USA' || veteranAddress.isMilitary;

  const childrenToAdd = formData?.childrenToAdd || [];
  const hasStepChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.stepchild,
  );
  const hasAdoptedChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.adopted,
  );
  const hasDisabledChild = childrenToAdd.some(
    childFormData =>
      childFormData?.doesChildHaveDisability &&
      childFormData?.doesChildHavePermanentDisability,
  );

  const showBirthCertificate = livesOutsideUSA || hasStepChild;

  return {
    showBirthCertificate,
    hasAdoptedChild,
    hasDisabledChild,
    needsChildUpload:
      showBirthCertificate || hasDisabledChild || hasAdoptedChild,
  };
};
