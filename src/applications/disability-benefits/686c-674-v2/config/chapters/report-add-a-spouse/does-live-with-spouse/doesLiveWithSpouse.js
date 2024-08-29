import cloneDeep from 'platform/utilities/data/cloneDeep';
import environment from 'platform/utilities/environment';
import {
  buildAddressSchema,
  addressUISchema,
  updateFormDataAddress,
} from '../../../address-schema';
import { addSpouse } from '../../../utilities';
import { doesLiveTogether, liveWithYouTitle } from './helpers';

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
      'ui:title': liveWithYouTitle,
      'ui:widget': 'yesNo',
      'ui:errorMessages': { required: 'Select an option' },
    },
    currentSpouseReasonForSeparation: {
      'ui:required': doesLiveTogether,
      'ui:title': 'Reason for separation',
      'ui:options': {
        expandUnder: 'spouseDoesLiveWithVeteran',
        expandUnderCondition: false,
      },
      'ui:errorMessages': { required: 'Give a brief explanation' },
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
    spouseIncome: {
      'ui:options': {
        hideIf: () => environment.isProduction(),
        hideEmptyValueInReview: true,
      },
      'ui:title': 'Did your spouse have income in the last 365 days?',
      'ui:description':
        'Answer this question only if you are adding this dependent to your pension.',
      'ui:widget': 'yesNo',
    },
  },
};

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'doesLiveWithSpouse',
    'address',
  ]);
