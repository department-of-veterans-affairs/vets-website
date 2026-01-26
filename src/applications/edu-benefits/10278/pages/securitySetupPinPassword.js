import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const uiSchema = {
  ...titleUI('Enter a pin or password'),
  securitySetup: {
    pinOrPassword: {
      ...textUI({
        title: (
          <>
            Pin or password (
            <span className="vads-u-color--red">*Required</span>)
          </>
        ),
        hint: 'Maximum limit is 30 characters',
        errorMessages: {
          required: 'Please enter a pin or password',
          pattern: 'You must provide a response',
        },
      }),
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    securitySetup: {
      type: 'object',
      properties: {
        pinOrPassword: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 30,
        },
      },
      required: ['pinOrPassword'],
    },
  },
};

export { schema, uiSchema };
