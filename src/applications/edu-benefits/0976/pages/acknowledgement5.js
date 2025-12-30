// @ts-check
import React from 'react';
import {
  textSchema,
  titleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import InitialsInput from '../components/InitialsInput';

import { validateInitialsMatch } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Institution Acknowledgements (5 of 5)'),
    acknowledgement10b: {
      ...textUI(
        'Institutions that participate in VA GI Bill programs must agree to electronic funds transfer (EFT) - Direct Deposit transactions for the payments of funds owed to the institution.',
      ),
      'ui:webComponentField': InitialsInput,
      'ui:description': (
        <p>
          <strong>Note:</strong> VA will contact the institution to make
          arrangements to set up electronic funds transfer (EFT) - Direct
          Deposit or international Direct Deposit Arrangement.
        </p>
      ),
      'ui:options': {
        width: 'small',
        classNames: 'vads-u-margin-bottom--6',
        messageAriaDescribedby: 'Enter your initials',
      },
      'ui:errorMessages': {
        required: 'Enter initials',
        minLength: 'Enter your initials using letters only',
        pattern: 'Enter your initials using letters only',
      },
      'ui:validations': [validateInitialsMatch],
    },
  },
  schema: {
    type: 'object',
    properties: {
      acknowledgement10b: {
        ...textSchema,
        minLength: 2,
        maxLength: 3,
        pattern: '^[A-Za-z]{2,3}$',
      },
    },
    required: ['acknowledgement10b'],
  },
};
