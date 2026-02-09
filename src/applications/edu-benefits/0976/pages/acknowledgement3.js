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
    ...titleUI('Institution Acknowledgements (3 of 5)'),
    ...descriptionUI(
      <div>
        <p>
          The institution understands the following important program
          requirements and/or limitations.
        </p>
        <ul>
          <li>
            Institution will be financially responsible to VA for the payments
            made directly to the educational institution pursuant to the
            Post-9/11 GI Bill, and the Yellow Ribbon GI Bill Educational
            Enhancement Program.
          </li>
          <li>
            Institution will not impose any penalty, including the assessment of
            late fees, the denial of access to classes, or other institutional
            facilities, or require that VA students borrow funds due to
            VA-delayed disbursement of funding.
          </li>
          <li>
            Institution will not engage in advertising and/or enrollment
            practices of any type, which are erroneous, deceptive, or misleading
            ither by actual statements, omission or intimidation.
          </li>
          <li>
            Institutions are prohibited from using “GI Bill” in any manner that
            directly or indirectly implies a relationship affiliation, or
            endorsement affiliation with the department of Veterans Affairs.
          </li>
          <li>
            Institution must select an employee to act as a VA contact person
            (School Certifying Official) and will complete a new VA Form
            22-8794, Designation of Certifying Official, whenever a new employee
            is selected to preform this role.
          </li>
          <li>
            Institution agrees to adhere to the VA GI Bill Trademark Terms of
            Use. Please click this link for information regarding the Terms of
            Use.{' '}
            <va-link
              external
              text="Trademark Terms of Use - Education and Training (va.gov)"
              href="https://www.benefits.va.gov/GIBILL/Trademark_Terms_of_Use.asp"
            />
          </li>
          <li>
            Institution agrees to submit all enrollment certifications and any
            amendments, adjustments, or terminations electronically through the
            Enrollment Management (EM) system.
          </li>
        </ul>
      </div>,
    ),
    acknowledgement9: {
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
      acknowledgement9: {
        ...textSchema,
        minLength: 2,
        maxLength: 3,
        pattern: '^[A-Za-z]{2,3}$',
      },
    },
    required: ['acknowledgement9'],
  },
};
