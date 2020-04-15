import { genericSchemas } from '../../../generic-schema';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { doesLiveTogether } from './helpers';

const { genericTextInput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    spouseDoesLiveWithVeteran: {
      type: 'boolean',
    },
    currentSpouseReasonForSeparation: genericTextInput,
    currentSpouseAddress: buildAddressSchema(false),
  },
};

export const uiSchema = {
  spouseDoesLiveWithVeteran: {
    'ui:required': () => true,
    'ui:title': 'Does your spouse live with you?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': { required: 'Please select an option' },
  },
  currentSpouseReasonForSeparation: {
    'ui:required': doesLiveTogether,
    'ui:title': 'Reason for separation',
    'ui:options': {
      expandUnder: 'spouseDoesLiveWithVeteran',
      expandUnderCondition: false,
    },
    'ui:errorMessages': { required: 'Please give a brief explanation' },
  },
  currentSpouseAddress: {
    ...addressUISchema(false, 'currentSpouseAddress', doesLiveTogether),
    'ui:title': 'Your spouse’s address',
    'ui:options': {
      expandUnder: 'spouseDoesLiveWithVeteran',
      expandUnderCondition: false,
      // if someone selects a country, and then changes their mind and selects 'yes' for spouseDoesLiveWithVeteran,
      // The collapsed form will silently throw an error because some fields are required based on country.
      // manually clearning the required array fixes this issue.
      updateSchema: (formData, formSchema) =>
        formData.spouseDoesLiveWithVeteran ? { required: [] } : formSchema,
    },
  },
};
