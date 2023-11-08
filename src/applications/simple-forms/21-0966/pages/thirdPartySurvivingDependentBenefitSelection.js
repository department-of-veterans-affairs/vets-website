import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { survivingDependentBenefits } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    benefitSelection: checkboxGroupUI({
      title: 'Select the benefit the claimant intends to file a claim for',
      required: true,
      labelHeaderLevel: '3',
      tile: true,
      labels: {
        [survivingDependentBenefits.SURVIVOR]: {
          title:
            'Survivors pension and/or dependency and indemnity compensation (DIC)',
          description:
            'Select this option if you intend to file a DIC claim (VA Form 21P-534 or VA Form 21P-534EZ).',
        },
      },
      errorMessages: {
        required: 'Select the benefit listed',
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
      benefitSelection: checkboxGroupSchema(
        Object.values(survivingDependentBenefits),
      ),
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['benefitSelection'],
  },
};
