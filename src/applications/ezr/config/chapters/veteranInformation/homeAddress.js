import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  descriptionUI,
  inlineTitleUI,
  inlineTitleSchema,
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
    'view:pageTitle': inlineTitleUI(content['vet-home-address-title']),
    veteranHomeAddress: merge(
      {},
      addressUI(null, true),
      DEFAULT_ADDRESS_OVERRIDES.uiSchema,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': inlineTitleSchema,
      veteranHomeAddress: merge(
        {},
        addressSchema(ezrSchema, true),
        DEFAULT_ADDRESS_OVERRIDES.schema,
      ),
    },
  },
};
