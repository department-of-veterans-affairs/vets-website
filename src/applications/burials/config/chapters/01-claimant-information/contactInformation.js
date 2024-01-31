import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { generateTitle } from '../../../utils/helpers';

const {
  claimantEmail,
  claimantPhone,
  claimantIntPhone,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Contact information'),
    claimantEmail: emailUI(),
    claimantPhone: phoneUI('Your phone number'),
    claimantIntPhone: phoneUI('Your international phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      claimantEmail,
      claimantPhone,
      claimantIntPhone,
    },
  },
};
