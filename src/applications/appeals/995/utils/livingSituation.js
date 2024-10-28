import { SC_NEW_FORM_DATA } from '../constants';

export const showScNewForm = formData => formData[SC_NEW_FORM_DATA];

export const hasHousingRisk = formData =>
  showScNewForm(formData) && formData.housingRisk;

export const hasOtherHousingRisk = formData =>
  showScNewForm(formData) &&
  hasHousingRisk(formData) &&
  formData.livingSituation?.other;
