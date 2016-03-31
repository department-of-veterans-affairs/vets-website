// Functions that produce calculated values given a state.
//

export function neverMarried(state) {
  return state.nameAndGeneralInformation.maritalStatus === '' ||
    state.nameAndGeneralInformation.maritalStatus === 'Never Married';
}
