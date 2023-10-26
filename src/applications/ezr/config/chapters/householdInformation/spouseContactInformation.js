import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { DEFAULT_ADDRESS_OVERRIDES } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const { phone } = ezrSchema.definitions;

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-contact-info-title']),
    spouseAddress: merge(
      {},
      addressUI(null, true),
      DEFAULT_ADDRESS_OVERRIDES.uiSchema,
    ),
    spousePhone: phoneUI(content['household-sponse-phone-label']),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: merge(
        {},
        addressSchema(ezrSchema, true),
        DEFAULT_ADDRESS_OVERRIDES.schema,
      ),
      spousePhone: phone,
    },
  },
};
