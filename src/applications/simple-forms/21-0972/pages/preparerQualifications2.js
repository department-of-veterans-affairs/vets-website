import React from 'react';

import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { preparerSigningReasonOptions } from '../definitions/constants';
import { preparerSigningReasonQuestionTitle } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerSigningReason: checkboxGroupUI({
      title: '',
      labels: preparerSigningReasonOptions,
      required: true,
      errorMessages: {
        required:
          'You must select at least one option, so we can process your certification.',
      },
      updateSchema: formData => {
        return {
          title: preparerSigningReasonQuestionTitle({ formData }),
        };
      },
    }),
    'view:explanation': {
      'ui:description': (
        <>
          <br />
          <va-additional-info trigger="Why we ask for this information">
            <div>
              We can only accept alternate signers for one or more of the
              reasons listed here.
            </div>
          </va-additional-info>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerSigningReason: checkboxGroupSchema(
        Object.keys(preparerSigningReasonOptions),
      ),
      'view:explanation': {
        type: 'object',
        properties: {},
      },
    },
    required: ['preparerSigningReason'],
  },
};
