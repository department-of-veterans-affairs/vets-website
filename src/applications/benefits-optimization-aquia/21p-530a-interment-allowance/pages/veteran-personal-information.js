import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { isValidNameLength } from '../../shared/utils/validators/validators';

const customVeteranNameUISchema = () => {
  const baseSchema = fullNameNoSuffixUI();
  return {
    ...baseSchema,
    first: {
      ...baseSchema.first,
      'ui:title': 'First or given name',
      'ui:validations': [
        ...baseSchema.first['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranInformation?.fullName?.first,
            12,
          );
        },
      ],
    },
    middle: {
      ...baseSchema.middle,
      'ui:title': 'Middle initial',
    },
    last: {
      ...baseSchema.last,
      'ui:title': 'Last or family name',
      'ui:validations': [
        ...baseSchema.last['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.veteranInformation?.fullName?.last,
            18,
          );
        },
      ],
    },
  };
};

export const veteranPersonalInformationPage = {
  uiSchema: {
    ...titleUI("Veteran's name"),
    veteranInformation: {
      fullName: customVeteranNameUISchema(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['fullName'],
        properties: {
          fullName: {
            ...fullNameNoSuffixSchema,
            properties: {
              ...fullNameNoSuffixSchema.properties,
              first: {
                ...fullNameNoSuffixSchema.properties.first,
              },
              middle: {
                ...fullNameNoSuffixSchema.properties.middle,
                maxLength: 1,
              },
              last: {
                ...fullNameNoSuffixSchema.properties.last,
              },
            },
          },
        },
      },
    },
  },
};
