import ResolutionOptions from '../../components/ResolutionOptions';
import {
  CurrentDebtTitle,
  CurrentDebtDescription,
} from '../../components/CurrentDebtTitle';
import { resolutionOptionSelected } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': CurrentDebtDescription,
      resolutionOption: {
        'ui:validations': [resolutionOptionSelected],
        'ui:title': ' ',
        'ui:widget': ResolutionOptions,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        // required: ['resolutionOption'],
        properties: {
          resolutionOption: {
            type: 'string',
          },
        },
      },
    },
  },
};
