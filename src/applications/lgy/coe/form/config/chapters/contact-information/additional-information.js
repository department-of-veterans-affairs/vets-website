import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import { contactInformation } from '../../schemaImports';

export const title = 'Additional contact information';

const { additionalInformation } = contactInformation;

export const schema = {
  ...additionalInformation,
  title,
  properties: {
    ...additionalInformation.properties,
    'view:confirmContactEmail': {
      $ref: '#/definitions/email',
    },
  },
};

export const uiSchema = {
  contactPhone: {
    ...phoneUI(),
    'ui:title': 'Phone number',
  },
  contactEmail: emailUI(),
  'view:confirmContactEmail': {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, _fieldData, formData) => {
          if (
            formData.contactEmail.toLowerCase() !==
            formData['view:confirmContactEmail'].toLowerCase()
          ) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  },
};
