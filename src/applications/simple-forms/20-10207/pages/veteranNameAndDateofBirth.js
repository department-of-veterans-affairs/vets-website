import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  getNameAndDobPageTitle,
  getNameAndDobPageDescription,
  getFullNameLabels,
} from '../helpers';

// set custom max-lengths per PDF
const customNameSchema = fullNameNoSuffixSchema;
customNameSchema.properties.first.maxLength = 12;
customNameSchema.properties.middle.maxLength = 1;
customNameSchema.properties.last.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getNameAndDobPageTitle(formData),
      ({ formData }) => getNameAndDobPageDescription(formData),
    ),
    veteranFullName: fullNameNoSuffixUI(label => getFullNameLabels(label)),
    veteranDateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: customNameSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranFullName', 'veteranDateOfBirth'],
  },
};
