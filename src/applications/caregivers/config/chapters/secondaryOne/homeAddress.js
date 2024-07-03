// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { addressWithAutofillSchema } from '../../../definitions/sharedSchema';
import { addressWithAutofillUI } from '../../../definitions/sharedUI';
import { replaceStrValues } from '../../../utils/helpers';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { address } = fullSchema.definitions;
const inputLabel = content['secondary-one-input-label'];

const secondaryOneHomeAddress = {
  uiSchema: {
    ...titleUI(
      content['secondary-one-info-title--address-home'],
      content['secondary-one-address-description--home'],
    ),
    secondaryOneAddress: addressWithAutofillUI(),
    'view:secondaryOneHomeSameAsMailingAddress': yesNoUI(
      replaceStrValues(content['form-address-same-as-label'], inputLabel),
    ),
  },
  schema: {
    type: 'object',
    required: ['view:secondaryOneHomeSameAsMailingAddress'],
    properties: {
      secondaryOneAddress: addressWithAutofillSchema(address),
      'view:secondaryOneHomeSameAsMailingAddress': yesNoSchema,
    },
  },
};

export default secondaryOneHomeAddress;
