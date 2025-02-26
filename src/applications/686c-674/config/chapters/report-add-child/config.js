/** @type {ArrayBuilderOptions} */

function isItemIncomplete(item) {
  return (
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    !item?.ssn ||
    !item?.birthLocation?.location?.city ||
    (!item?.birthLocation?.outsideUsa &&
      !item?.birthLocation?.location?.state) ||
    (item?.birthLocation?.outsideUsa === true &&
      !item?.birthLocation?.location?.country) ||
    !item?.birthLocation?.location?.postalCode ||
    typeof item?.isBiologicalChild === 'undefined' ||
    typeof item?.isBiologicalChildOfSpouse === 'undefined' ||
    (item?.isBiologicalChild === false &&
      (typeof item?.relationshipToChild !== 'object' ||
        item?.relationshipToChild === null ||
        Object.keys(item?.relationshipToChild).length === 0)) ||
    !item?.dateEnteredHousehold ||
    !item?.biologicalParentName?.first ||
    !item?.biologicalParentName?.last ||
    !item?.biologicalParentDob ||
    !item?.biologicalParentSsn ||
    typeof item?.doesChildHaveDisability === 'undefined' ||
    (item?.doesChildHaveDisability === true &&
      typeof item?.doesChildHavePermanentDisability === 'undefined') ||
    typeof item?.doesChildLiveWithYou === 'undefined' ||
    typeof item?.hasChildEverBeenMarried === 'undefined' ||
    (item?.marriageEndReason === 'other' && !item?.marriageEndDescription)
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
