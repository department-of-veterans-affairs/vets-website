// @ts-check
import React from 'react';
import {
  textSchema,
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import InitialsInput from '../components/InitialsInput';

import { validateInitialsMatch } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Institution Acknowledgements (1 of 5)'),
    ...descriptionUI(
      <div>
        <p>
          The following are requirements for participation. VA must be able to
          verify the following information using the submitted documentation or
          other published information.
        </p>
        <ul>
          <li>
            The institution has adequate available space, the appropriate
            facilities and equipment to conduct the programs for which it seeks
            approval.
          </li>
          <li>
            The institution has a calendar showing holidays, closings, beginning
            and end-dates of each quarter, term or semester, and other important
            dates, such as exam periods.
          </li>
          <li>
            The institution has documented policies relative to the refund of
            the unused portion of a tuition, fees, and other charges in the
            event a student withdraws or discontinues their enrollment.
          </li>
        </ul>
        <p>
          Schools deemed Nonaccredited for VA purposes. Any institution which
          fails to forward any refund due within 40 days after such a change in
          status, shall be deemed, prima facie, to have failed to make a prompt
          refund and may be suspended or withdrawn from eligibility.
        </p>
      </div>,
    ),
    acknowledgement7: {
      'ui:title': 'Initial here',
      'ui:webComponentField': InitialsInput,
      'ui:options': {
        width: 'small',
        classNames: 'vads-u-margin-bottom--6',
      },
      'ui:errorMessages': {
        required: 'Enter your initials',
        minLength: 'Enter your initials using letters only',
        pattern: 'Enter your initials using letters only',
      },
      'ui:validations': [validateInitialsMatch],
    },
  },
  schema: {
    type: 'object',
    properties: {
      acknowledgement7: {
        ...textSchema,
        minLength: 2,
        maxLength: 3,
        pattern: '^[A-Za-z]{2,3}$',
      },
    },
    required: ['acknowledgement7'],
  },
};
