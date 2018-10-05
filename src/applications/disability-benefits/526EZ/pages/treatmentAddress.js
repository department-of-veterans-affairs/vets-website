import { get } from 'lodash';

import {
  MILITARY_CITIES,
  MILITARY_STATE_VALUES,
  USA,
} from '../../all-claims/constants';

function validateMilitaryCity(errors, city, formData, schema, messages, index) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    get(formData, `treatments[${index}].treatmentCenterAddress.state`, ''),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

function validateMilitaryState(
  errors,
  state,
  formData,
  schema,
  messages,
  index,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    get(formData, `treatments[${index}].treatmentCenterAddress.city`, '')
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

const uiSchema = {
  'ui:order': ['country', 'state', 'city'],
  country: {
    'ui:title': 'Country',
  },
  city: {
    'ui:title': 'City',
    'ui:validations': [validateMilitaryCity],
  },
  state: {
    'ui:title': 'State',
    'ui:validations': [validateMilitaryState],
    'ui:options': {
      expandUnder: 'country',
      expandUnderCondition: USA,
    },
  },
};

export default uiSchema;
