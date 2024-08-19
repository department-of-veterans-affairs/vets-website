import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  addressUI,
  addressSchema,
  descriptionUI,
  titleUI,
  titleSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

const {
  veteranAddress: { properties: schemaOverride },
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': titleUI(
      content['vet-mailing-address-title'],
      content['vet-mailing-address-description'],
    ),
    veteranAddress: addressUI(),
    'view:doesMailingMatchHomeAddress': yesNoUI(
      content['vet-address-match-title'],
    ),
  },
  schema: {
    type: 'object',
    required: ['view:doesMailingMatchHomeAddress'],
    properties: {
      'view:pageTitle': titleSchema,
      veteranAddress: merge({}, addressSchema(), {
        properties: schemaOverride,
      }),
      'view:doesMailingMatchHomeAddress': yesNoSchema,
    },
  },
};
