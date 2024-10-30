import { showScNewForm } from './toggle';

export const hasHousingRisk = formData =>
  showScNewForm(formData) && formData.housingRisk;

export const hasOtherHousingRisk = formData =>
  showScNewForm(formData) &&
  hasHousingRisk(formData) &&
  formData.livingSituation?.other;
