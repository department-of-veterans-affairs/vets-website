export const hasHousingRisk = formData => formData.housingRisk;

export const hasOtherHousingRisk = formData =>
  hasHousingRisk(formData) && formData.livingSituation?.other;
