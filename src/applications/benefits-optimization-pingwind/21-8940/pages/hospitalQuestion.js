import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { hospitalizationQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [hospitalizationQuestionFields.parentObject]: {
      ...titleUI('Your Recent Medical Treatment '),
      [hospitalizationQuestionFields.hasBeenHospitalized]: yesNoUI({
        title: 'Have you been hospitalized in the past 12 months?',
        labels: {
          Y: 'Yes, I have been hospitalized in the past 12 months ',
          N: 'No, I have NOT been hospitalized in the past 12 months ',
        },
        errorMessages: {
          required:
            'Select a response to tell us if you have been hospitalized in the past 12 months.',
        },
      }),
      'view:nonVAAuthorizationInfo': {
        'ui:description': () => (
          <div>
            <p>
              <strong>Important:</strong> If you were treated by Non-VA
              hospital, use these forms to authorize the release of information
              to VA. Select the links to complete these forms in the online
              portal.
            </p>
            <ul>
              <li>

                <a
                  href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VA Form 21-4142 – Authorization to Disclose Information to the
                  Department of Veterans Affairs (opens in a new tab)
                </a>

              </li>
              <li>

                <a
                  href="/find-forms/about-form-21-4142a/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VA Form 21-4142a - General Release for Medical Provider Information to the Department of Veterans Affairs (opens in a new tab)
                </a>

              </li>
            </ul>
            <p>
              These forms allow VA to request your medical records from non-VA
              healthcare providers.
            </p>
          </div>
        ),
        'ui:options': {
          expandUnder: hospitalizationQuestionFields.hasBeenHospitalized,
          expandUnderCondition: value => value === true || value === 'Y',
        },
      },

      'ui:options': {
        showFieldLabel: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [hospitalizationQuestionFields.parentObject]: {
        type: 'object',
        required: [hospitalizationQuestionFields.hasBeenHospitalized],
        properties: {
          [hospitalizationQuestionFields.hasBeenHospitalized]: yesNoSchema,
          'view:nonVAAuthorizationInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
