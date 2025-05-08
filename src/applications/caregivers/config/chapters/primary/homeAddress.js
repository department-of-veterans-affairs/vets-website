import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { addressWithAutofillSchema } from '../../../definitions/sharedSchema';
import { addressWithAutofillUI } from '../../../definitions/sharedUI';
import { replaceStrValues } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { address } = FULL_SCHEMA.definitions;
const inputLabel = content['primary-input-label'];

const primaryHomeAddress = {
  uiSchema: {
    ...titleUI(
      content['primary-info-title--address-home'],
      content['primary-address-description--home'],
    ),
    primaryAddress: addressWithAutofillUI(),
    'view:primaryHomeSameAsMailingAddress': yesNoUI(
      replaceStrValues(content['form-address-same-as-label'], inputLabel),
    ),
  },
  schema: {
    type: 'object',
    required: ['view:primaryHomeSameAsMailingAddress'],
    properties: {
      primaryAddress: addressWithAutofillSchema(address),
      'view:primaryHomeSameAsMailingAddress': yesNoSchema,
    },
  },
};

export default primaryHomeAddress;
