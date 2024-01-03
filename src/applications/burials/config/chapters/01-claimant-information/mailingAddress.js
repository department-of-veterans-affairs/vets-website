import {
  addressSchema,
  addressUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';

const { firmName, officialPosition } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': 'Mailing address',
    'ui:description':
      'We’ll send any important information about your application to this address',
    claimantAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'I live on on a United States military base outside of the U.S.',
        },
        omit: ['street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['claimantAddress'],
    properties: {
      firmName,
      officialPosition,
      claimantAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
