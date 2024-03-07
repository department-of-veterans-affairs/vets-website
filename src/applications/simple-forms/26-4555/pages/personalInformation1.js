import { pick } from 'lodash';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

const { properties } = fullSchema.properties[veteranFields.parentObject];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      ...titleUI('Name and date of birth'),
      [veteranFields.fullName]: fullNameNoSuffixUI(),
      [veteranFields.dateOfBirth]: dateOfBirthUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.fullName, veteranFields.dateOfBirth],
        properties: {
          ...pick(properties, pageFields),
          fullName: fullNameNoSuffixSchema,
        },
      },
    },
  },
};
