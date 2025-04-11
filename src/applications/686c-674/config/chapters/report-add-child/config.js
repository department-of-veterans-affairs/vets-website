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
  if (birthLocation?.outsideUsa && !birthLocation?.location?.country)
    return true;
  if (!birthLocation?.location?.postalCode) return true;
  return false;
}

function isRelationshipRequiredButMissing(item) {
  return (
    item.isBiologicalChild === false && isObjectEmpty(item.relationshipToChild)
  );
}

function isStepchildInfoIncomplete(item) {
  return (
    item.relationshipToChild?.stepchild &&
    (typeof item.isBiologicalChildOfSpouse === 'undefined' ||
      isFieldMissing(item.dateEnteredHousehold) ||
      isFieldMissing(item.biologicalParentName?.first) ||
      isFieldMissing(item.biologicalParentName?.last) ||
      isFieldMissing(item.biologicalParentSsn) ||
      isFieldMissing(item.biologicalParentDob))
  );
}

function isChildDisabilityInfoIncomplete(item) {
  return (
    typeof item.doesChildHaveDisability === 'undefined' ||
    (item.doesChildHaveDisability &&
      typeof item.doesChildHavePermanentDisability === 'undefined')
  );
}

function isMarriageInfoMissing(item) {
  return (
    item.hasChildEverBeenMarried &&
    (isFieldMissing(item.marriageEndDate) ||
      isFieldMissing(item.marriageEndReason))
  );
}

function isOtherMarriageReasonMissing(item) {
  return (
    item.marriageEndReason === 'other' &&
    isFieldMissing(item.marriageEndDescription)
  );
}

function isLivingSituationInfoMissing(item) {
  return (
    item.doesChildLiveWithYou === false &&
    (isObjectEmpty(item.address) ||
      isFieldMissing(item.livingWith?.first) ||
      isFieldMissing(item.livingWith?.last))
  );
}

function isItemIncomplete(item) {
  const errors = [];

  const fail = (condition, msg) => {
    if (condition) errors.push(msg);
  };

  fail(isFieldMissing(item?.fullName?.first), 'Missing child first name');
  fail(isFieldMissing(item?.fullName?.last), 'Missing child last name');
  fail(isFieldMissing(item?.birthDate), 'Missing birth date');
  fail(isFieldMissing(item?.ssn), 'Missing SSN');
  fail(
    isBirthLocationIncomplete(item?.birthLocation),
    'Incomplete birth location',
  );
  fail(
    typeof item?.isBiologicalChild === 'undefined',
    'isBiologicalChild is undefined',
  );
  fail(
    isRelationshipRequiredButMissing(item),
    'Missing relationshipToChild for non-biological child',
  );
  fail(
    isChildDisabilityInfoIncomplete(item),
    'Disability information incomplete',
  );
  fail(
    typeof item?.doesChildLiveWithYou === 'undefined',
    'doesChildLiveWithYou is undefined',
  );
  fail(
    typeof item?.hasChildEverBeenMarried === 'undefined',
    'hasChildEverBeenMarried is undefined',
  );

  fail(isStepchildInfoIncomplete(item), 'Stepchild info is incomplete');
  fail(isMarriageInfoMissing(item), 'Marriage end date or reason missing');
  fail(
    isOtherMarriageReasonMissing(item),
    'Marriage end reason "other" description missing',
  );
  fail(
    isLivingSituationInfoMissing(item),
    'Child address or livingWith info missing',
  );

  return errors.length > 0;
}

export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete,
  maxItems: 20,
  text: {
    getItemName: () => 'Child',
    cardDescription: item => {
      return (
        `${item?.fullName?.first ?? ''} ${item?.fullName?.last ?? ''}`.trim() ||
        ' '
      );
    },
  },
};
