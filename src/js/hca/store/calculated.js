// Functions that produce calculated values given a state.
//

export function neverMarried(state) {
  return state.veteran.maritalStatus.value === '' ||
    state.veteran.maritalStatus.value === 'Never Married';
}


// Shared functions.
//
export function displayLabel(fullList, userValue) {
  let newValue;
  for (let i = 0; i < fullList.length; i++) {
    if (userValue === fullList[i].value) {
      newValue = fullList[i].label;
    }
  }
  return newValue;
}
