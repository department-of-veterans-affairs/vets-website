import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

const { usaPhone } = commonDefinitions;

import PhoneReviewField from './components/PhoneReviewField';
import YesNoReviewField from './components/YesNoReviewField';
import { formFields } from './constants';
import { titleCase } from './helpers';
import { validateHomePhone, validateMobilePhone } from './utils/validation';
import CustomPhoneNumberField from './components/CustomPhoneNumberField';

export function phoneUISchema(category) {
  const schema = {
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
    },
    'ui:objectViewField': PhoneReviewField,
    phone: {
      ...phoneUI(`${titleCase(category)} phone number`),
      'ui:validations': [
        category === 'mobile' ? validateMobilePhone : validateHomePhone,
      ],
    },
    isInternational: {
      'ui:title': `This ${category} phone number is international.`,
      'ui:reviewField': YesNoReviewField,
      'ui:options': {
        hideIf: formData => {
          if (category === 'mobile') {
            if (
              !formData[formFields.viewPhoneNumbers][
                formFields.mobilePhoneNumber
              ].phone
            ) {
              return true;
            }
          } else if (
            !formData[formFields.viewPhoneNumbers][formFields.phoneNumber].phone
          ) {
            return true;
          }
          return false;
        },
      },
    },
  };

  // use custom component if mobile phone
  if (category === 'mobile') {
    schema.phone['ui:widget'] = CustomPhoneNumberField;
  }

  return schema;
}

export function phoneSchema() {
  return {
    type: 'object',
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
      isInternational: {
        type: 'boolean',
      },
    },
  };
}
