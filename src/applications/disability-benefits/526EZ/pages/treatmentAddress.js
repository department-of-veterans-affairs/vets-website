import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/path/vets-json-schema/dist/21-526EZ-schema.json';

import  {
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA,
  ADDRESS_TYPES
} from '../constants';

function validateMilitaryCity(errors, city, formData, schema, messages, index) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(formData, `treatments[${index}].treatmentCenterAddress.state`, '')
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError('City must match APO, DPO, or FPO when using a military state code');
  }
}

function validateMilitaryState(errors, state, formData, schema, messages, index) {
  // console.log('state: ', state); // current state selection
  // console.log('formData: ', formData); // current disability
  // console.log('index: ', index); // index in treatments array
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(formData, `treatments[${index}].treatmentCenterAddress.city`, '').trim().toUpperCase()
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

const uiSchema = {
  'ui:order': ['country', 'city', 'state'],
  country: {
    'ui:title': 'Country'
  },
  city: {
    'ui:title': 'City',
    'ui:validations': [validateMilitaryCity]
  },
  state: {
    'ui:title': 'State',
    'ui:validations': [validateMilitaryState],
    'ui:options': {
      hideIf: (formData, index) => {
        console.log(formData); // disabilities: [{...}. [...}]
        console.log(index); // index in treatments array for current disability
        console.log(_.get(formData, `treatments[${index}].treatmentCenterAddress.country`, 'nothing'));
        return _.get(formData, `treatments[${index}].treatmentCenterAddress.country`, '') !== USA;
      }
    //   updateSchema: () => {}
    }
  }
};

export default uiSchema;
