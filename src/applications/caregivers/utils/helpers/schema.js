import get from 'platform/utilities/data/get';
import { MED_CENTERS_BY_STATE } from '../constants';

export const setAddressCountry = (
  formData,
  _schema,
  uiSchema,
  _index,
  path,
) => {
  const USA = { value: 'USA', label: 'United States' };
  const addressPath = path.slice(0, -1);
  const countryUI = uiSchema;
  const addressFormData = get(addressPath, formData) ?? {};
  countryUI['ui:options'].inert = true;
  addressFormData.country = USA.value;
  return {
    enum: [USA.value],
    enumNames: [USA.label],
    default: USA.value,
  };
};

export const setPlannedClinics = formData => {
  const state = formData['view:plannedClinicState'];
  return { enum: MED_CENTERS_BY_STATE[state] || [] };
};
