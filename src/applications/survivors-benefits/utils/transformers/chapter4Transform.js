import { combineCityState, truncateName, buildChildStatus } from './helpers';

export function chapter4Transform(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  // combine city and state/country for place of marriage and place of separation
  // for marriage and each previous/veteran previous marriage

  if (parsedFormData?.marriageToVeteranEndLocation) {
    transformedValue.placeOfMarriageTermination = combineCityState(
      parsedFormData.marriageToVeteranEndLocation?.city,
      parsedFormData.marriageToVeteranEndLocation?.state ||
        parsedFormData.marriageToVeteranEndLocation?.country,
    );
  }

  if (parsedFormData?.marriageToVeteranStartLocation) {
    transformedValue.placeOfMarriage = combineCityState(
      parsedFormData.marriageToVeteranStartLocation?.city,
      parsedFormData.marriageToVeteranStartLocation?.state ||
        parsedFormData.marriageToVeteranStartLocation?.country,
    );
  }

  if (parsedFormData?.spouseMarriages?.length) {
    transformedValue.spouseMarriages = parsedFormData.spouseMarriages.map(
      marriage => {
        return {
          ...marriage,
          locationOfMarriage: combineCityState(
            marriage.locationOfMarriage?.city,
            marriage.locationOfMarriage?.state ||
              marriage.locationOfMarriage?.country,
          ),
          locationOfSeparation: combineCityState(
            marriage.locationOfSeparation?.city,
            marriage.locationOfSeparation?.state ||
              marriage.locationOfSeparation?.country,
          ),
          spouseFullName: truncateName(marriage.spouseFullName, 12, 1, 18),
          reasonForSeparationExplanation: marriage?.separationExplanation || '',
        };
      },
    );
  }

  if (parsedFormData?.veteranMarriages?.length) {
    transformedValue.veteranMarriages = parsedFormData.veteranMarriages.map(
      marriage => {
        return {
          ...marriage,
          locationOfMarriage: combineCityState(
            marriage.locationOfMarriage?.city,
            marriage.locationOfMarriage?.state ||
              marriage.locationOfMarriage?.country,
          ),
          locationOfSeparation: combineCityState(
            marriage.locationOfSeparation?.city,
            marriage.locationOfSeparation?.city ||
              marriage.locationOfSeparation?.country,
          ),
          spouseFullName: truncateName(marriage.spouseFullName, 12, 1, 18),
          reasonForSeparationExplanation: marriage?.separationExplanation || '',
        };
      },
    );
  }

  if (parsedFormData?.veteransChildren?.length) {
    transformedValue.veteransChildren = parsedFormData.veteransChildren.map(
      child => {
        return {
          ...child,
          childFullName: truncateName(child.childFullName, 12, 1, 18),
          childPlaceOfBirth: combineCityState(
            child.birthPlace?.city,
            child.birthPlace?.state || child.birthPlace?.country,
          ),
          childStatus: buildChildStatus(child),
        };
      },
    );
  }

  // yes/no for separation dur to marital discord...
  if (parsedFormData?.separationDueToAssignedReasons) {
    if (
      parsedFormData.separationDueToAssignedReasons === 'MEDICAL_FINANCIAL' ||
      parsedFormData.separationDueToAssignedReasons ===
        'RELATIONSHIP_DIFFERENCES'
    ) {
      transformedValue.separationDueToAssignedReasons = true;
    } else {
      transformedValue.separationDueToAssignedReasons = false;
    }
  }
  // combine dates of marriage
  if (
    parsedFormData?.marriageToVeteranStartDate ||
    parsedFormData?.marriageToVeteranEndDate
  ) {
    transformedValue.marriageDates = {
      from: parsedFormData.marriageToVeteranStartDate || '',
      to: parsedFormData.marriageToVeteranEndDate || '',
    };
  }

  // Fixes for a11y issue when hideIf field starts with the same word as trigger field.
  if (parsedFormData?.endCauseExplanation) {
    transformedValue.remarriageEndCauseExplanation =
      parsedFormData.endCauseExplanation;
  }

  if (parsedFormData?.marriageEndedExplanation) {
    transformedValue.howMarriageEndedExplanation =
      parsedFormData.marriageEndedExplanation;
  }

  if (parsedFormData?.typeOfMarriageExplanation) {
    transformedValue.marriageTypeExplanation =
      parsedFormData.typeOfMarriageExplanation;
  }

  if (parsedFormData?.custodianFullName) {
    transformedValue.custodianFullName = truncateName(
      parsedFormData.custodianFullName,
      12,
      1,
      18,
    );
  }

  return JSON.stringify(transformedValue);
}
