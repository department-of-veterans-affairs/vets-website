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
  const errors = [];

  const fail = (condition, msg) => {
    if (condition) {
      errors.push(msg);
      return true;
    }
    return false;
  };

  // Basic required fields
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
    isRelationshipIncomplete(item),
    'Missing relationshipToChild details (required for non-biological children)',
  );
  fail(isChildDisabilityInfoIncomplete(item), 'Disability info incomplete');
  fail(
    typeof item?.doesChildLiveWithYou === 'undefined',
    'doesChildLiveWithYou is undefined',
  );
  fail(
    typeof item?.hasChildEverBeenMarried === 'undefined',
    'hasChildEverBeenMarried is undefined',
  );
  fail(
    isMarriageInfoIncomplete(item),
    'Marriage info is incomplete if reason is "other"',
  );

  // Conditional sections
  if (
    item?.isBiologicalChild === false &&
    isObjectEmpty(item?.relationshipToChild)
  ) {
    errors.push('Missing relationshipToChild block for non-biological child');
  }

  if (
    item?.relationshipToChild?.stepchild &&
    (typeof item?.isBiologicalChildOfSpouse === 'undefined' ||
      isFieldMissing(item?.dateEnteredHousehold) ||
      isFieldMissing(item?.biologicalParentName?.first) ||
      isFieldMissing(item?.biologicalParentName?.last) ||
      isFieldMissing(item?.biologicalParentSsn) ||
      isFieldMissing(item?.biologicalParentDob))
  ) {
    errors.push('Stepchild info is incomplete');
  }

  if (
    item?.doesChildHaveDisability === true &&
    typeof item?.doesChildHavePermanentDisability === 'undefined'
  ) {
    errors.push('Missing doesChildHavePermanentDisability for disabled child');
  }

  if (
    item?.hasChildEverBeenMarried &&
    (isFieldMissing(item?.marriageEndDate) ||
      isFieldMissing(item?.marriageEndReason))
  ) {
    errors.push('Missing marriage end date or reason');
  }

  if (
    item?.marriageEndReason === 'other' &&
    isFieldMissing(item?.marriageEndDescription)
  ) {
    errors.push('Missing description for marriage end reason "other"');
  }

  if (
    item?.doesChildLiveWithYou === false &&
    (isObjectEmpty(item?.address) ||
      isFieldMissing(item?.livingWith?.first) ||
      isFieldMissing(item?.livingWith?.last))
  ) {
    errors.push('Missing child address or who they are living with');
  }

  if (errors.length > 0) {
    // console.log('Item is incomplete for the following reasons:');
    // errors.forEach(e => console.log(e));
    return true;
  }

  return false;
}

export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete,
  maxItems: 20,
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
