import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import { contactInformation } from '../../schemaImports';

export const title = 'Additional contact information';

const { additionalInformation } = contactInformation;

export const schema = {
  ...additionalInformation,
  title,
  properties: additionalInformation.properties,
};

export const uiSchema = {
  contactPhone: {
    ...phoneUI(),
    'ui:title': 'Phone number',
  },
  contactEmail: emailUI(),
};
