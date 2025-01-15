/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete: item => {
    return (
      !item?.fullName?.first ||
      !item?.fullName?.last ||
      !item?.birthDate ||
      !item.ssn ||
      !item.birthLocation.location.state ||
      !item.birthLocation.location.postalCode ||
      !item.relationshipToChild ||
      typeof item.doesChildLiveWithYou === 'undefined' ||
      typeof item.hasChildEverBeenMarried === 'undefined' ||
      typeof item.incomeInLastYear === 'undefined'
    );
  },
  maxItems: 10,
  text: {
    getItemName: () => {
      return 'Child';
    },
    cardDescription: item => {
      return `${item?.fullName?.first} ${item?.fullName?.last}`;
    },
  },
};
