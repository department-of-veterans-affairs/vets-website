import React from 'react';
import {
  inlineTitleUI,
  yesNoSchema,
  yesNoUI,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { hospitalizationQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [hospitalizationQuestionFields.parentObject]: {
      ...inlineTitleUI('Your Recent Medical Treatment '),
      [hospitalizationQuestionFields.hasBeenHospitalized]: yesNoUI({
        title: 'Have you been hospitalized in the past 12 months?',
        labels: {
          Y: 'Yes, I have been hospitalized in the past 12 months ',
          N: 'No, I have NOT been hospitalized in the past 12 months ',
        },
      }),
      'view:treatmentAtNonVA': radioUI({
        title: 'Where were you treated?',
        labels: {
          nonVa: 'Non-VA Hospital',
          va: 'VA Hospital',
          both: 'Both VA and Non-VA Hospital',
        },
        errorMessages: {
          required: 'Please select where you were treated.',
        },
      }),
      'view:nonVAAuthorizationInfo': {
        'ui:description': () => (
          <div>
            <p>
              <strong>Important:</strong> You must authorize the release of non-VA medical information to VA using these forms:
            </p>
            <ul>
              <li>
                <va-link
                  href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
                  text="VA Form 21-4142 - Authorization to Disclose Information to the Department of Veterans Affairs"
                />
              </li>
              <li>
                <va-link
                  href="/find-forms/about-form-21-4142a/"
                  text="VA Form 21-4142a - General Release for Medical Provider Information to the Department of Veterans Affairs"
                />
              </li>
            </ul>
            <p>
              These forms allow VA to request your medical records from non-VA healthcare providers.
            </p>
          </div>
        ),
        'ui:options': {
          expandUnder: 'view:treatmentAtNonVA',
          expandUnderCondition: (val) => val === 'va' || val === 'both',
        },
      },

      'ui:options': {
        showFieldLabel: true,
        /* classNames: 'confirmation-required-radio',*/
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
          'view:treatmentAtNonVA': radioSchema(['nonVa', 'va', 'both']),
          'view:nonVAAuthorizationInfo': {
            type: 'object',
            properties: {}
          },
        },
      },
    },
  },
};
