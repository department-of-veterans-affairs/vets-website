import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {UISchemaOptions} */

export const uiSchema = {
  'ui:description': () => {
    return (
      <>
        <h3>Tell us how you’re connected to the Veteran</h3>
      </>
    );
  },
  authorizeInsideVARadio: radioUI({
    title: 'What’s your relationship to the Veteran?',
  }),
};

/** @type {UISchemaOptions} */
export const schema = {
  type: 'object',
  required: ['authorizeInsideVARadio'],
  properties: {
    authorizeInsideVARadio: radioSchema([
      'I’m the Veteran’s spouse',
      'I’m the Veteran’s child',
      'I’m the Veteran’s parent',
      'I’m the Veteran’s accredited representative',
      'We don’t have a relationship that’s listed here',
    ]),
  },
};
