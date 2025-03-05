function isFieldMissing(value) {
  return value === undefined || value === null || value === '';
}

function isObjectEmpty(obj) {
  return (
    typeof obj !== 'object' || obj === null || Object.keys(obj).length === 0
  );
}

function isBirthLocationIncomplete(birthLocation) {
  if (!birthLocation?.location?.city) return true;

  if (!birthLocation?.outsideUsa && !birthLocation?.location?.state)
    return true;

  if (birthLocation?.outsideUsa === true && !birthLocation?.location?.country)
    return true;

  if (!birthLocation?.location?.postalCode) return true;

  return false;
}

function isRelationshipIncomplete(item) {
  return (
    item.isBiologicalChild === false && isObjectEmpty(item.relationshipToChild)
  );
}

function isChildDisabilityInfoIncomplete(item) {
  return (
    typeof item.doesChildHaveDisability === 'undefined' ||
    (item.doesChildHaveDisability === true &&
      typeof item.doesChildHavePermanentDisability === 'undefined')
  );
}

function isMarriageInfoIncomplete(item) {
  return (
    item.marriageEndReason === 'other' &&
    isFieldMissing(item.marriageEndDescription)
  );
}

function isItemIncomplete(item) {
  return (
    isFieldMissing(item?.fullName?.first) ||
    isFieldMissing(item?.fullName?.last) ||
    isFieldMissing(item?.birthDate) ||
    isFieldMissing(item?.ssn) ||
    isBirthLocationIncomplete(item?.birthLocation) ||
    typeof item?.isBiologicalChild === 'undefined' ||
    typeof item?.isBiologicalChildOfSpouse === 'undefined' ||
    isRelationshipIncomplete(item) ||
    isFieldMissing(item?.dateEnteredHousehold) ||
    isFieldMissing(item?.biologicalParentName?.first) ||
    isFieldMissing(item?.biologicalParentName?.last) ||
    isFieldMissing(item?.biologicalParentDob) ||
    isFieldMissing(item?.biologicalParentSsn) ||
    isChildDisabilityInfoIncomplete(item) ||
    typeof item?.doesChildLiveWithYou === 'undefined' ||
    typeof item?.hasChildEverBeenMarried === 'undefined' ||
    isMarriageInfoIncomplete(item) ||
    // relationshipPartTwo (Only if child is NOT biological)
    (item?.isBiologicalChild === false &&
      isObjectEmpty(item?.relationshipToChild)) ||
    // stepchild Page
    (item?.relationshipToChild?.stepchild &&
      (typeof item?.isBiologicalChildOfSpouse === 'undefined' ||
        isFieldMissing(item?.dateEnteredHousehold) ||
        isFieldMissing(item?.biologicalParentName?.first) ||
        isFieldMissing(item?.biologicalParentName?.last) ||
        isFieldMissing(item?.biologicalParentSsn) ||
        isFieldMissing(item?.biologicalParentDob))) ||
    // disabilityPartTwo (If child has a disability)
    (item?.doesChildHaveDisability === true &&
      typeof item?.doesChildHavePermanentDisability === 'undefined') ||
    // marriageEndDetailsPartOne (If child has ever been married)
    (item?.hasChildEverBeenMarried &&
      (isFieldMissing(item?.marriageEndDate) ||
        isFieldMissing(item?.marriageEndReason))) ||
    // marriageEndDetailsPartTwo (If marriage ended for 'other' reason)
    (item?.marriageEndReason === 'other' &&
      isFieldMissing(item?.marriageEndDescription)) ||
    // childAddressPartOne & childAddressPartTwo (If child does NOT live with user)
    (item?.doesChildLiveWithYou === false &&
      (isObjectEmpty(item?.address) ||
        isFieldMissing(item?.livingWith?.first) ||
        isFieldMissing(item?.livingWith?.last)))
  );
}

export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete,
  maxItems: 10,
  text: {
    getItemName: () => {
      return 'Child';
    },
    cardDescription: item => {
      return `${item?.fullName?.first ? item?.fullName?.first : ''} ${
        item?.fullName?.last ? item?.fullName?.last : ''
      }`;
    },
  },
};
