import React from 'react';
import {
  getFullName,
  getFormatedDate,
  isFieldMissing,
  isEmptyObject,
} from '../../../../shared/utils';

/**
 * @typedef {object} BirthLocation
 * @property {object} location - Location object
 * @property {string} location.city - City name
 * @property {string} [location.state] - State code
 * @property {string} [location.country] - Country name (if outside USA)
 * @property {string} location.postalCode - Postal code
 *
 * @param {BirthLocation} birthLocation - location object
 * @returns {boolean} True if birth location is incomplete, false otherwise
 */
function isBirthLocationIncomplete(birthLocation) {
  return (
    !birthLocation ||
    !birthLocation.location ||
    !birthLocation.location.city ||
    (!birthLocation.outsideUsa && !birthLocation.location.state) ||
    (birthLocation.outsideUsa && !birthLocation.location.country) ||
    !birthLocation.location.postalCode
  );
}

/**
 * Check if relationshipToChild has a value if the dependent is not a biological
 * child
 * @typedef {object} RelationshipItem
 * @property {boolean} isBiologicalChild - Indicates if child is biological
 * @property {object} relationshipToChild - Relationship to child object
 *
 * @param {RelationshipItem} item - Relationship item
 * @returns {boolean} True if dependent is not a biological child and
 * required relationship is missing, false otherwise
 */
function isRelationshipRequiredButMissing(item) {
  return (
    item.isBiologicalChild === false && isEmptyObject(item.relationshipToChild)
  );
}

/**
 * @typedef {object} StepChildInfo
 * @property {object} relationshipToChild - Relationship to child object
 * @property {boolean} isBiologicalChildOfSpouse - Is biological child of spouse
 * @property {string} dateEnteredHousehold - Date entered household
 * @property {object} biologicalParentName - Biological parent name object
 * @property {string} biologicalParentName.first - Biological parent first name
 * @property {string} biologicalParentName.last - Biological parent last name
 * @property {string} biologicalParentSsn - Biological parent SSN
 * @property {string} biologicalParentDob - Biological parent date of birth
 *
 * @param {StepChildInfo} item - Step child info
 * @returns {boolean} True if stepchild info is incomplete, false otherwise
 */
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

/**
 * @typedef {object} ChildDisability
 * @property {boolean} doesChildHaveDisability - Does child have disability
 * @property {boolean} doesChildHavePermanentDisability - Does child have
 * permanent disability
 *
 * @param {ChildDisability} item - Child disability info
 * @returns {boolean} True if child disability info is incomplete, false
 * otherwise
 */
function isChildDisabilityInfoIncomplete(item) {
  return (
    typeof item.doesChildHaveDisability === 'undefined' ||
    (item.doesChildHaveDisability &&
      typeof item.doesChildHavePermanentDisability === 'undefined')
  );
}

/**
 * Check of marriage end other reason description is missing
 * @typedef {object} MarriageEndProps
 * @property {string} marriageEndReason - Marriage end reason
 * @property {string} marriageEndDescription - Marriage end description
 *
 * @param {MarriageEndProps} item - Marriage end info
 * @returns {boolean} True if marriage end reason is 'other' and description is
 * missing, false otherwise
 */
function isOtherMarriageReasonMissing(item) {
  return (
    item.marriageEndReason === 'other' &&
    isFieldMissing(item.marriageEndDescription)
  );
}

/**
 * @typedef {object} ChildLivingWithProps
 * @property {boolean} doesChildLiveWithYou - Does child live with you
 * @property {object} address - Address object
 * @property {object} livingWith - Living with person object
 * @property {string} livingWith.first - Living with person first name
 * @property {string} livingWith.last - Living with person last name
 *
 * @param {ChildLivingWithProps} item - Child living situation
 * @returns {boolean} True if living situation info is missing, false otherwise
 */
function isLivingSituationInfoMissing(item) {
  return (
    item.doesChildLiveWithYou === false &&
    (isEmptyObject(item.address) ||
      isFieldMissing(item.livingWith?.first) ||
      isFieldMissing(item.livingWith?.last))
  );
}

/**
 * @typedef {object} ChildInfoProps
 * @property {object} fullName - Full name object
 * @property {string} fullName.first - First name
 * @property {string} fullName.last - Last name
 * @property {string} birthDate - Birth date
 * @property {string} ssn - SSN
 * @property {BirthLocation} birthLocation - Birth location object
 * @property {boolean} isBiologicalChild - Is biological child
 * @property {object} relationshipToChild - Relationship to child object
 * @property {boolean} doesChildHaveDisability - Does child have disability
 * @property {boolean} doesChildHavePermanentDisability - Does child have
 * permanent disability
 * @property {boolean} doesChildLiveWithYou - Does child live with you
 * @property {string} hasChildEverBeenMarried - Has child ever been married
 * @property {object} marriageEndReason - Marriage end reason object
 * @property {string} marriageEndDescription - Marriage end description
 * @property {object} address - Address object
 * @property {object} livingWith - Living with person object
 * @property {boolean} isBiologicalChildOfSpouse - Is biological child of spouse
 * @property {string} dateEnteredHousehold - Date entered household
 * @property {object} biologicalParentName - Biological parent name object
 * @property {string} biologicalParentName.first - Biological parent first name
 * @property {string} biologicalParentName.last - Biological parent last name
 * @property {string} biologicalParentSsn - Biological parent SSN
 * @property {string} biologicalParentDob - Biological parent date of birth
 *
 * @param {ChildInfoProps} item - Child info
 * @returns {boolean} True if any required field is missing or incomplete, false
 * otherwise
 */
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
        <strong
          className="dd-privacy-mask"
          data-dd-action-name="child date of birth"
        >
          {' '}
          {getFormatedDate(item?.birthDate)}
        </strong>
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
