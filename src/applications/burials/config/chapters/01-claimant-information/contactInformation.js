import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';

const { claimantEmail, claimantPhone } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': 'Contact information',
    claimantEmail: emailUI(),
    claimantPhone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      claimantEmail,
      claimantPhone,
    },
  },
};
