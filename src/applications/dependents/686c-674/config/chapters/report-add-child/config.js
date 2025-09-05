import React from 'react';
import { getFullName, getFormatedDate } from '../../../../shared/utils';

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
    getItemName: item => getFullName(item.fullName),
    cardDescription: item => (
      <div>
        Date of birth:
        <strong> {getFormatedDate(item?.birthDate)}</strong>
      </div>
    ),
    duplicateSummaryCardLabel: () => 'POSSIBLE DUPLICATE',
    duplicateSummaryCardExternalComparisonWarningOrErrorAlert: ({
      itemData,
    }) => (
      <>
        You’ve entered multiple children named {getFullName(itemData.fullName)}{' '}
        with a birthdate of {getFormatedDate(itemData.birthDate)}
        <p>
          Before continuing, review these entries and delete any duplicates.
        </p>
      </>
    ),
    duplicateSummaryCardExternalComparisonInfoAlert: () =>
      'This child shares a birthday with someone already on your benefits.',
  },
  summaryPageDuplicateChecks: {
    allowDuplicates: true,
    comparisonType: 'external',
    comparisons: ['fullName.first', 'fullName.last', 'birthDate'],
    externalComparisonData: (/* { formData, index, arrayData } */) => {
      /* formData = Full form data
         * index = Current item index
         * arrayData = data gathered from arrayPath based on comparisons
         * return array of array strings for comparison with arrayData
         *
         * [
         *   ['MiKe', 'SmItH', '2020-01-01'],
         *   ['JOHN', 'SMITH', '2022-01-01'],
         * ];
         */
      return [['fred', 'smith', '2020-01-01'], ['john', 'smith', '2022-01-01']];
    },
  },
};
