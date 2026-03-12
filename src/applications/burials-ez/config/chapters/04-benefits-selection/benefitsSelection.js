import React from 'react';
import {
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import { checkboxGroupSchemaWithReviewLabels } from '../../../utils/helpers';
import { benefitsLabels } from '../../../utils/labels';

export default {
  uiSchema: {
    ...titleUI('Costs you paid for'),
    'ui:description': (
      <>
        <p>
          You should know that by selecting any of these costs, one of these
          things must be true:
        </p>
        <ul>
          <li>
            You paid for them yourself, <strong>or</strong>
          </li>
          <li>You’re the executor of the deceased Veteran's estate</li>
        </ul>
        <p>
          If you paid for transportation costs for the Veteran’s remains, you’ll
          need to upload an itemized receipt. We’ll ask you to upload this later
          in this form.
        </p>
      </>
    ),
    'view:claimedBenefits': checkboxGroupUI({
      title: 'Which of these costs did you pay for?',
      required: true,
      labelHeaderLevel: '',
      tile: false,
      labels: benefitsLabels,
      errorMessages: {
        required: 'Please select at least one option',
      },
      validations: [validateBooleanGroup],
    }),
  },
  schema: {
    type: 'object',
    required: ['view:claimedBenefits'],
    properties: {
      'view:claimedBenefits': checkboxGroupSchemaWithReviewLabels([
        'burialAllowance',
        'plotAllowance',
        'transportation',
      ]),
    },
  },
};
