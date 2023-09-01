import definitions from 'vets-json-schema/dist/definitions.json';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1Schema, titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleH1UI('Your name and date of birth'),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      'view:title': titleH1Schema,
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: definitions.date,
    },
  },
};
