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
const inputLabel = content['secondary-two-input-label'];

const secondaryTwoHomeAddress = {
  uiSchema: {
    ...titleUI(
      content['secondary-two-info-title--address-home'],
      content['secondary-two-address-description--home'],
    ),
    secondaryTwoAddress: addressWithAutofillUI(),
    'view:secondaryTwoHomeSameAsMailingAddress': yesNoUI(
      replaceStrValues(content['form-address-same-as-label'], inputLabel),
    ),
  },
  schema: {
    type: 'object',
    required: ['view:secondaryTwoHomeSameAsMailingAddress'],
    properties: {
      secondaryTwoAddress: addressWithAutofillSchema(address),
      'view:secondaryTwoHomeSameAsMailingAddress': yesNoSchema,
    },
  },
};

export default secondaryTwoHomeAddress;
