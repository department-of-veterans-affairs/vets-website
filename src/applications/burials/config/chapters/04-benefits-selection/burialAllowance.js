import React from 'react';
import {
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { allowanceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial allowance'),
    burialAllowanceRequested: {
      ...radioUI({
        title:
          'Are you claiming a burial allowance for a service-connected or non-service connected death?',
        required: true,
        labels: allowanceLabels,
        // hint: 'This is a hint',
        // errorMessages: {
        //   required: 'Please select an animal',
        // },
        classNames: 'vads-u-margin-top--0 vads-u-margin-bottom--2',
      }),
    },
    unclaimedRemains: yesNoUI({
      title:
        'Are you claiming a burial allowance for unclaimed remains of a Veteran?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:allowanceStatement': {
      'ui:description': (
        <>
          <p classNames="vads-u-font-size--md vads-u-font-family--sans">
            You selected that you're claiming a burial allowance for the
            unclaimed remains of a Veteran.
          </p>
          <p classNames="vads-u-font-size--md vads-u-font-family--sans">
            To makes this claim, you'll need to confirm that both of these
            statements are true:
          </p>
          <ul classNames="vads-u-font-size--md vads-u-font-family--sans">
            <li>
              The remains of the Veteran have not been claimed by their family
              members or friends, <strong>and</strong>
            </li>
            <li>
              The Veteran's estate doesn't have the financial resources to pay
              for burial and funeral expenses
            </li>
          </ul>
        </>
      ),
      'ui:options': {
        hideIf: form => get('form.unclaimedRemains', form) !== 'false',
      },
      confirmation: {
        'ui:title': 'I confirm these statements are true',
        // 'ui:required': () => true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['burialAllowanceRequested', 'unclaimedRemains'],
    properties: {
      burialAllowanceRequested: {
        ...radioSchema(['service', 'nonService']),
      },
      unclaimedRemains: yesNoSchema,
      'view:allowanceStatement': {
        type: 'object',
        properties: {
          confirmation: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
