import {
  phoneUI,
  emailUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
    claimantEmail: {
      ...emailUI(),
      'ui:webComponentField': VaTextInput,
      'ui:options': {
        uswds: true,
      },
    },
    claimantPhone: {
      ...phoneUI('Your phone number'),
      'ui:webComponentField': VaTextInput,
      'ui:options': {
        uswds: true,
      },
    },
    claimantIntPhone: {
      ...phoneUI('Your international phone number'),
      'ui:webComponentField': VaTextInput,
      'ui:options': {
        uswds: true,
      },
    },
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
