import React from 'react';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { generateTitle } from '../../../utils/helpers';

const confError = 'Confirm that these statements are true';

export default {
  uiSchema: {
    'view:allowanceStatement': {
      'ui:title': generateTitle('Statement of truth'),
      'ui:description': (
        <>
          <p>
            You selected that you’re claiming a burial allowance for the
            unclaimed remains of a Veteran.
          </p>
          <p>
            To make this claim, you’ll need to confirm that both of these
            statements are true:
          </p>
          <ul>
            <li>
              The remains of the Veteran have not been claimed by their family
              members or friends, <strong>and</strong>
            </li>
            <li>
              The Veteran’s estate doesn’t have the financial resources to pay
              for burial and funeral expenses
            </li>
          </ul>
        </>
      ),
      confirmation: {
        checkBox: {
          'ui:title': 'I confirm these statements are true',
          'ui:webComponentField': VaCheckboxField,
          'ui:required': form =>
            get('burialAllowanceRequested.unclaimed', form),
          'ui:errorMessages': {
            required: confError,
          },
          'ui:validations': [
            // require at least one value to be true/checked
            (errors, _data, formData, _schema, errorMessages) => {
              const { required } = errorMessages;
              if (
                formData?.['view:allowanceStatement']?.confirmation
                  ?.checkBox !== true
              ) {
                errors.addError(required);
              }
            },
          ],
          'ui:options': {
            messageAriaDescribedby: `I confirm these statements are true. The remains of the Veteran have not been claimed by their family members or friends, and the Veteran's estate doesn't have the financial resources to pay for burial and funeral expenses.`,
          },
        },
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
            type: 'object',
            properties: {
              checkBox: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};
