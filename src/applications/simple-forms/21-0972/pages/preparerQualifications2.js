import React from 'react';

import { preparerSigningReasonOptions } from '../definitions/constants';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { preparerSigningReasonQuestionTitle } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerSigningReason: {
      'ui:widget': GroupCheckboxWidget,
      'ui:errorMessages': {
        required:
          'You must select at least one option, so we can process your certification.',
      },
      'ui:options': {
        updateSchema: formData => {
          return {
            title: preparerSigningReasonQuestionTitle({ formData }),
          };
        },
        forceDivWrapper: true,
        labels: Object.values(preparerSigningReasonOptions),
        showFieldLabel: true,
      },
    },
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
      preparerSigningReason: {
        type: 'string',
      },
      'view:explanation': {
        type: 'object',
        properties: {},
      },
    },
    required: ['preparerSigningReason'],
  },
};
