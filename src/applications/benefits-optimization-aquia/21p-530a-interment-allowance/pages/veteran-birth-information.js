import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { states } from '@department-of-veterans-affairs/platform-forms/address';

export const veteranBirthInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s birth information'),
    veteranInformation: {
      dateOfBirth: currentOrPastDateUI('Date of birth'),
      placeOfBirth: {
        city: textUI('City of birth'),
        state: selectUI('State of birth'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['dateOfBirth'],
        properties: {
          dateOfBirth: currentOrPastDateSchema,
          placeOfBirth: {
            type: 'object',
            properties: {
              city: textSchema,
              state: {
                type: 'string',
                enum: states.USA.map(state => state.label),
              },
            },
          },
        },
      },
    },
  },
};
