import React from 'react';
import {
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { allowanceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

const confError = 'Confirm that these statements are true';

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
    // Mock up #1
    // 'view:allowanceStatement': {
    //   'ui:options': {
    //     hideIf: form => !get('unclaimedRemains', form),
    //   },
    //   'ui:description': (
    //     <>
    //       <p classNames="vads-u-font-size--md vads-u-font-family--sans">
    //         You selected that you're claiming a burial allowance for the
    //         unclaimed remains of a Veteran.
    //       </p>
    //       <p classNames="vads-u-font-size--md vads-u-font-family--sans">
    //         To makes this claim, you'll need to confirm that both of these
    //         statements are true:
    //       </p>
    //       <ul classNames="vads-u-font-size--md vads-u-font-family--sans">
    //         <li>
    //           The remains of the Veteran have not been claimed by their family
    //           members or friends, <strong>and</strong>
    //         </li>
    //         <li>
    //           The Veteran's estate doesn't have the financial resources to pay
    //           for burial and funeral expenses
    //         </li>
    //       </ul>
    //     </>
    //   ),
    //   confirmation: {
    //     ...checkboxGroupUI({
    //       title: ' ',
    //       required: form => get('unclaimedRemains', form),
    //       hideIf: form => !get('unclaimedRemains', form),
    //       errorMessages: {
    //         required: confError,
    //         atLeaseOne: confError,
    //       },
    //       labels: {
    //         checkBox: 'I confirm these statements are true',
    //       },
    //       classNames: 'vads-u-margin-top-0',
    //     }),
    //   },
    // },
    // Mock up #2
    'view:allowanceStatement': {
      ...checkboxGroupUI({
        title: ' ',
        required: form => get('unclaimedRemains', form),
        hideIf: form => !get('unclaimedRemains', form),
        errorMessages: {
          required: confError,
          atLeaseOne: confError,
        },
        labels: {
          confirmation: 'I confirm these statements are true',
        },
        description: (
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
        classNames: 'vads-u-margin-top-0',
      }),
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
      // Mock up #1
      // 'view:allowanceStatement': {
      //   type: 'object',
      //   properties: {
      //     confirmation: {
      //       ...checkboxGroupSchema(['checkBox']),
      //     },
      //   },
      // },
      // Mock up #2
      'view:allowanceStatement': {
        ...checkboxGroupSchema(['confirmation']),
      },
    },
  },
};
