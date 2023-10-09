import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  descriptionUI,
  inlineTitleUI,
  inlineTitleSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { DEFAULT_ADDRESS_OVERRIDES } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': inlineTitleUI(
      content['vet-mailing-address-title'],
      content['vet-mailing-address-description'],
    ),
    veteranAddress: merge(
      {},
      addressUI(null, true),
      DEFAULT_ADDRESS_OVERRIDES.uiSchema,
    ),
    'view:doesMailingMatchHomeAddress': yesNoUI(
      content['vet-address-match-title'],
    ),
  },
  schema: {
    type: 'object',
    required: ['view:doesMailingMatchHomeAddress'],
    properties: {
      'view:pageTitle': inlineTitleSchema,
      veteranAddress: merge(
        {},
        addressSchema(ezrSchema, true),
        DEFAULT_ADDRESS_OVERRIDES.schema,
      ),
      'view:doesMailingMatchHomeAddress': yesNoSchema,
    },
  },
};
