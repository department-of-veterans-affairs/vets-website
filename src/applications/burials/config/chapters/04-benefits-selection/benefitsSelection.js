import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import { generateTitle } from '../../../utils/helpers';
import { benefitsLabels } from '../../../utils/labels';

export default {
  uiSchema: {
    'ui:title': generateTitle('Costs you paid for'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-family--sans vads-u-margin-top--0">
          You should know that by selecting any of these costs, one of these
          things must be true:
        </p>
        <ul className="vads-u-font-size--md vads-u-font-family--sans">
          <li>
            You paid for them yourself, <strong>or</strong>
          </li>
          <li>You’re the executor of the deceased Veteran's estate</li>
        </ul>
        <p className="vads-u-font-size--md vads-u-font-family--sans">
          If you paid for transportation costs for the Veteran’s remains, you’ll
          need to upload an itemized receipt. We’ll ask you to upload this later
          in this form
        </p>
      </>
    ),
    'view:claimedBenefits': {
      ...checkboxGroupUI({
        title: 'Which of these costs did you pay for?',
        // hint: 'This is a hint',
        required: true,
        // description: <p>Testing p tags</p>,
        labelHeaderLevel: '',
        tile: false,
        uswds: true,
        labels: benefitsLabels,
        errorMessages: {
          required: 'Please select at least one option',
        },
        validations: [validateBooleanGroup],
      }),
      'ui:options': {
        classNames: 'vads-u-margin-top--0',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:claimedBenefits'],
    properties: {
      'view:claimedBenefits': {
        ...checkboxGroupSchema([
          'burialAllowance',
          'plotAllowance',
          'transportation',
        ]),
      },
    },
  },
};
