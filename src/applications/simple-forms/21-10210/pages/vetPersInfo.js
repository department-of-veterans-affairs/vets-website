import { cloneDeep } from 'lodash';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

const fullNameUiSchema = cloneDeep(fullNameUI);
// PDF only has 1 box for Middle name, so we need to override the title
fullNameUiSchema.middle['ui:title'] = 'Middle initial';

export default {
  uiSchema: {
    veteranFullName: fullNameUiSchema,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: formDefinitions.pdfFullNameNoSuffix,
      veteranDateOfBirth: definitions.date,
    },
  },
};
