import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { generateTitle } from '../../../utils/helpers';

const confError = 'Confirm that these statements are true';

export default {
  uiSchema: {
    'view:allowanceStatement': {
      'ui:title': generateTitle('Type of burial allowance'),
      'ui:description': (
        <>
          <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
            You selected that you're claiming a burial allowance for the
            unclaimed remains of a Veteran.
          </p>
          <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
            To make this claim, you'll need to confirm that both of these
            statements are true:
          </p>
          <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
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
      confirmation: {
        ...checkboxGroupUI({
          title: ' ',
          required: form => get('burialAllowanceRequested.unclaimed', form),
          errorMessages: {
            required: confError,
            atLeaseOne: confError,
          },
          labels: {
            checkBox: 'I confirm these statements are true',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:allowanceStatement': {
        type: 'object',
        properties: {
          confirmation: {
            ...checkboxGroupSchema(['checkBox']),
          },
        },
      },
    },
  },
};
