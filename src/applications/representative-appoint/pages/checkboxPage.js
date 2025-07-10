import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const checkboxOptions = {
  OPTION1: 'The first option',
  OPTION2: 'The second option',
  OPTION3: 'The third option',
  OPTION4: 'My option isn’t listed here',
};

/** @type {UISchemaOptions} */
export const uiSchema = {
  'ui:description': () => {
    return (
      <>
        <h3>Checkbox question</h3>
      </>
    );
  },
  checkbox1: radioUI({
    title: 'What’s the answer to this question?',
    labels: checkboxOptions,
    errorMessages: {
      enum: 'Select one that best describes you',
      required: 'Select one that best describes you',
    },
    required: () => true,
  }),

  'ui:options': {
    updateSchema: (_formData, formSchema) => {
      return {
        ...formSchema,
        required: ['checkbox1'],
      };
    },
  },
};

/** @type {UISchemaOptions} */
export const schema = {
  type: 'object',
  required: ['checkbox1'],
  properties: {
    checkbox1: radioSchema(Object.keys(checkboxOptions)),
  },
};
