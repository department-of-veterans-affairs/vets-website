export function doesHaveCareExpenses(formData) {
  return formData.hasCareExpenses === true;
}

export function doesHaveMedicalExpenses(formData) {
  return formData.hasMedicalExpenses === true;
}

export function ownsHome(formData) {
  return formData.homeOwnership === true;
}

export function doesReceiveIncome(formData) {
  return formData.receivesIncome === true;
}
