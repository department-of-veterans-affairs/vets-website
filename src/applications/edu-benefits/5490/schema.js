import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

const { usaPhone } = commonDefinitions;

import PhoneReviewField from '../1990e/components/PhoneReviewField';
import PhoneViewField from './components/PhoneViewField';
import YesNoReviewField from './components/YesNoReviewField';
import { newFormFields } from './constants';
import { titleCase } from './helpers';
import { isValidPhone, validatePhone } from './validation';

export function phoneUISchema(category, parent, international) {
  return {
    [parent]: {
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        viewComponent: PhoneViewField,
      },
      'ui:objectViewField': PhoneReviewField,
      phone: {
        ...phoneUI(`${titleCase(category)} phone number`),
        'ui:validations': [validatePhone],
      },
    },
    [international]: {
      'ui:title': `This ${category} phone number is international`,
      'ui:reviewField': YesNoReviewField,
      'ui:options': {
        // expandUnder: parent,
        hideIf: formData =>
          !isValidPhone(
            formData[newFormFields.newViewPhoneNumbers][parent].phone,
          ),
      },
    },
  };
}

export function phoneSchema() {
  return {
    type: 'object',
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
    },
  };
}
