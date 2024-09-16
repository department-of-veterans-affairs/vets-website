/** @type {ArrayBuilderOptions} */
const deceasedDependentOptions = {
  arrayPath: 'deaths',
  nounSingular: 'dependent',
  nounPlural: 'dependents',
  required: formData => formData?.arrayBuilderPatternFlowType === 'required',
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.ssn ||
    !item?.birthDate ||
    !item?.dependentType ||
    !item?.childStatus ||
    !item?.date,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item => `${item?.birthDate} - ${item?.date}`,
  },
};

export default deceasedDependentOptions;
