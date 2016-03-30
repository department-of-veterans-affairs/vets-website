// Functions that produce calculated values given a state.
//
export function financialAssessment(state) {
  return {
    receivesVaPension: state.vaInformation.receivesVaPension,
    neverMarried: state.nameAndGeneralInformation.maritalStatus === '' ||
      state.nameAndGeneralInformation.maritalStatus === 'Never Married'
  };
}
