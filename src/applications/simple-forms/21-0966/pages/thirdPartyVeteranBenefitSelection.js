import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns/';
import { veteranBenefits } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    benefitSelection: checkboxGroupUI({
      title:
        'Select the benefits the Veteran intends to file a claim for. Select all that apply',
      required: true,
      labelHeaderLevel: '3',
      tile: true,
      labels: {
        [veteranBenefits.COMPENSATION]: {
          title: 'Compensation',
          description:
            'Select this option if you intend to file for disability compensation (VA Form 21-526EZ).',
        },
        [veteranBenefits.PENSION]: {
          title: 'Pension',
          description:
            'Select this option if you intend to file a pension claim (VA Form 21P-527EZ).',
        },
      },
      errorMessages: {
        required: 'Select at least one benefit',
      },
    }),
    'view:additionalInfo': {
      'ui:description': (
        <va-additional-info trigger="What's an intent to file?">
          An intent to file request lets us know that you’re planning to file a
          claim. An intent to file reserves a potential effective date for when
          you could start getting benefits while you prepare your claim and
          gather supporting documents.
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelection: checkboxGroupSchema(Object.values(veteranBenefits)),
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['benefitSelection'],
  },
};
