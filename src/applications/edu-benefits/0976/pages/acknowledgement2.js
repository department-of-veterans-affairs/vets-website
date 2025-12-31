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
    ...titleUI('Institution Acknowledgements (2 of 5)'),
    ...descriptionUI(
      <div>
        <p>
          The institution must retain the records and account information of VA
          students for three years following the ending date of the last period
          of attendance certified to VA. The institution must make these records
          available for VA inspection upon request for the purpose of
          verification of compliance with the following program requirements
        </p>
        <ul>
          <li>
            Maintain sufficient records to show the progress of each VA student
            and to promptly inform VA when the conduct or progress of any VA
            student is not satisfactory in accordance with the regularly
            prescribed standards and practices of the institution.
          </li>
          <li>
            Institution will give appropriate credit for previous education and
            training of VA students and shorten the training program
            appropriately.
          </li>
          <li>
            Institution will only certify to VA, courses that are required for
            the completion of the student’s degree program.
          </li>
          <li>
            Institution will charge both VA and Non-VA students the same
            tuition, fees and other related miscellaneous amounts for the costs
            of attendance.
          </li>
          <li>
            Institution will agree to promptly inform the VA when it comes to
            the school’s attention that any VA student:
            <ul>
              <li>
                Has changes in hours of credit or attendance,{' '}
                <strong>or</strong>
              </li>
              <li>
                Has interrupted or discontinued a course program of study,
                giving the date(s) of withdrawal, and the reason(s), if known,{' '}
                <strong>or</strong>
              </li>
              <li>
                Completed/graduated from the program, <strong>or</strong>
              </li>
              <li>
                Receives grade(s) for any course(s) that will not be used when
                computing graduation requirements.
              </li>
            </ul>
          </li>
        </ul>
      </div>,
    ),
    acknowledgement8: {
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
      acknowledgement8: {
        ...textSchema,
        minLength: 2,
        maxLength: 3,
        pattern: '^[A-Za-z]{2,3}$',
      },
    },
    required: ['acknowledgement8'],
  },
};
