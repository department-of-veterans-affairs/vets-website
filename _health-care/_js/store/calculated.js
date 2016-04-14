// Functions that produce calculated values given a state.
//

export function neverMarried(state) {
  return state.veteran.nameAndGeneralInformation.maritalStatus === '' ||
    state.veteran.nameAndGeneralInformation.maritalStatus === 'Never Married';
}
