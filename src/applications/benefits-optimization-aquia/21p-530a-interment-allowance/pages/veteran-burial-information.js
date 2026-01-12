import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import { validateEndDateAfterStartDate } from '../utils/validationHelpers';

export const veteranBurialInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s interment information'),
    veteranInformation: {
      dateOfDeath: {
        ...currentOrPastDateUI('Date of death'),
        'ui:validations': [
          (errors, fieldData, formData) => {
            validateEndDateAfterStartDate(
              errors,
              fieldData,
              formData.veteranInformation,
              'dateOfBirth',
              'Please enter a date of death later than the date of birth.',
            );
          },
        ],
      },
    },
    burialInformation: {
      dateOfBurial: {
        ...currentOrPastDateUI('Date of burial'),
        'ui:validations': [
          (errors, fieldData, formData) => {
            validateEndDateAfterStartDate(
              errors,
              fieldData,
              formData.veteranInformation,
              'dateOfDeath',
              'Please enter a date of burial later than the date of death.',
            );
          },
        ],
      },
      placeOfBurial: {
        ...titleUI({
          title: 'Cemetery information',
          headerLevel: '4',
          classNames: 'vads-u-color--gray-dark',
        }),
        stateCemeteryOrTribalCemeteryName: textUI('Cemetery Name'),
        cemeteryLocation: {
          city: textUI('City'),
          state: selectUI('State'),
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['dateOfDeath'],
        properties: {
          dateOfDeath: currentOrPastDateSchema,
        },
      },
      burialInformation: {
        type: 'object',
        required: ['dateOfBurial'],
        properties: {
          dateOfBurial: currentOrPastDateSchema,
          placeOfBurial: {
            type: 'object',
            required: ['stateCemeteryOrTribalCemeteryName'],
            properties: {
              stateCemeteryOrTribalCemeteryName: textSchema,
              cemeteryLocation: {
                type: 'object',
                required: ['city', 'state'],
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
    },
  },
};
