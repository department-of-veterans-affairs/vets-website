import cloneDeep from 'platform/utilities/data/cloneDeep';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { addSpouse } from '../../../utilities';
import { doesLiveTogether } from './helpers';

const livingStatusSchema = cloneDeep(addSpouse.properties.doesLiveWithSpouse);
livingStatusSchema.properties.address = buildAddressSchema(true);

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: livingStatusSchema,
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
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
    address: {
      ...addressUISchema(true, 'doesLiveWithSpouse.address', doesLiveTogether),
      'ui:title': 'Your spouse’s address',
      'ui:options': {
        expandUnder: 'spouseDoesLiveWithVeteran',
        expandUnderCondition: false,
        // if someone selects a country, and then changes their mind and selects 'yes' for spouseDoesLiveWithVeteran,
        // The collapsed form will silently throw an error because some fields are required based on country.
        // manually clearning the required array fixes this issue.
        updateSchema: (formData, formSchema) =>
          formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran
            ? { required: [] }
            : formSchema,
      },
    },
  },
};
