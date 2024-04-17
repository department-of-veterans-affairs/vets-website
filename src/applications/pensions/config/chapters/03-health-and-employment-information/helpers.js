import moment from 'moment/moment';

export function hasFederalTreatmentHistory(formData) {
  return formData.federalTreatmentHistory === true;
}

export function hasNoSocialSecurityDisability(formData) {
  return formData.socialSecurityDisability === false;
}

export function hasVaTreatmentHistory(formData) {
  return formData.vaTreatmentHistory === true;
}

export function isInNursingHome(formData) {
  return formData.nursingHome === true;
}

export function isUnder65(formData, currentDate) {
  const today = currentDate || moment();
  return (
    today
      .startOf('day')
      .subtract(65, 'years')
      .isBefore(formData.veteranDateOfBirth) || !formData.isOver65
  );
}

export function isEmployedUnder65(formData) {
  return formData.currentEmployment === true && isUnder65(formData);
}

export function isUnemployedUnder65(formData) {
  return formData.currentEmployment === false && isUnder65(formData);
}

export function medicaidDoesNotCoverNursingHome(formData) {
  return formData.nursingHome === true && formData.medicaidCoverage === false;
}
