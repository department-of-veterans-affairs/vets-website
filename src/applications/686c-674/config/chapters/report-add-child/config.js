/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete: item => {
    let isBirthLocationIncomplete = !item?.birthLocation?.location?.postalCode;
    if (!item?.birthLocation?.outsideUsa) {
      isBirthLocationIncomplete =
        !item?.birthLocation?.location?.postalCode ||
        !item?.birthLocation?.location?.state;
    }
    return (
      !item?.fullName?.first ||
      !item?.fullName?.last ||
      !item?.birthDate ||
      !item?.ssn ||
      isBirthLocationIncomplete ||
      !item?.relationshipToChild ||
      typeof item?.doesChildLiveWithYou !== 'boolean' ||
      typeof item?.hasChildEverBeenMarried !== 'boolean' ||
      typeof item?.incomeInLastYear !== 'boolean'
    );
  },
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
