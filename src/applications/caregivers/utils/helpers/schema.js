import { mapValues } from 'lodash';
import get from 'platform/utilities/data/get';
import { CAREGIVER_FACILITIES as facilities } from '../imports';

export const MED_CENTERS_BY_STATE = mapValues(facilities, val =>
  val.map(c => c.code),
);

export const MED_CENTER_LABELS = Object.keys(facilities).reduce(
  (labels, state) => {
    const stateLabels = facilities[state].reduce(
      (centers, center) =>
        Object.assign(centers, {
          [center.code]: center.label,
        }),
      {},
    );

    return Object.assign(labels, stateLabels);
  },
  {},
);

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
