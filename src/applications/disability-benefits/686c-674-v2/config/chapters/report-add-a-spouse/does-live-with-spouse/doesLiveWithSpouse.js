import {
  yesNoSchema,
  yesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { updateFormDataAddress } from '../../../address-schema';
import { generateTitle } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        spouseDoesLiveWithVeteran: yesNoSchema,
      },
    },
    currentMarriageInformation: {
      type: 'object',
      properties: {
        date: currentOrPastDateSchema,
      },
    },
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
    'ui:title': generateTitle('Information about your marriage'),
    spouseDoesLiveWithVeteran: yesNoUI({
      title: 'Do you live with your spouse?',
      required: () => true,
      errorMessages: {
        required: 'Make a selection',
      },
    }),
  },
  currentMarriageInformation: {
    date: {
      ...currentOrPastDateUI('When did you get married?'),
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Enter the date you got married',
      },
    },
  },
};

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'doesLiveWithSpouse',
    // 'address',
  ]);
