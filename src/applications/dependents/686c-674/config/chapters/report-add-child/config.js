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
    duplicateSummaryCardLabel: () => 'DUPLICATE CHILD',
    duplicateSummaryCardWarningOrErrorAlert: () => (
      <>
        <p className="vads-u-margin-top--0">
          You’ve entered this dependent name and date of birth more than once.
        </p>
        <p>Review your entries, edit or delete any duplicates.</p>
      </>
    ),
    duplicateSummaryCardInfoAlert: () =>
      'This child shares a date of birth with someone already on your benefits.',
  },
  duplicateChecks: {
    comparisonType: 'internal',
    comparisons: ['fullName.first', 'fullName.last', 'birthDate'],

    itemPathModalChecks: {
      // change comparison for '686-report-add-child/:index/information' page
      information: {
        comparisonType: 'external',
        comparisons: ['birthDate'],
        externalComparisonData: ({ formData }) => {
          const dependents = formData?.dependents || {};
          if (
            !formData.vaDependentsDuplicateModals ||
            !dependents?.hasDependents
          ) {
            return [];
          }
          return dependents.awarded
            ?.filter(
              dependent =>
                dependent.relationshipToVeteran.toLowerCase() === 'child',
            )
            .map(child => [child.dateOfBirth || '']);
        },

        // NOTE: Text settings here get props in a different shape from the
        // options text object
        duplicateModalTitle: () =>
          'You already have a dependent with this date of birth',
        // Not using itemData here because name chanages
        duplicateModalDescription: props => {
          const { itemData, fullData } = props;
          const { birthDate } = itemData || '';
          // get Full name of duplicate dependent loaded in by prefill
          const dependentToShow =
            fullData?.dependents?.awarded?.find(
              dep => dep.dateOfBirth === birthDate,
            ) || itemData;
          return (
            <>
              Our records show a dependent with the date of birth{' '}
              <strong>{getFormatedDate(birthDate)}</strong>, already listed on
              your benefits as{' '}
              <strong>{getFullName(dependentToShow.fullName)}</strong>.
              <p>
                If you need to add another dependent with the same date of
                birth, you can continue adding this dependent.
              </p>
            </>
          );
        },
        duplicateModalPrimaryButtonText: () => 'Cancel',
        duplicateModalSecondaryButtonText: () => 'Continue adding',
      },
    },
  },
};
