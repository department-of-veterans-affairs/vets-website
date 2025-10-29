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
      ...titleUI({
        title: 'Your Recent Medical Treatment ',
      }),
      [hospitalizationQuestionFields.hasBeenHospitalized]: yesNoUI({
        title: 'Have you been hospitalized in the past 12 months?',
        labels: {
          Y: 'Yes, I confirm',
          N: 'No, I do not confirm',
        },
      }),
      'view:treatmentAtNonVA': yesNoUI({
        title: 'Were you treated at a Non-VA hospital or VA hospital?',
        labels: {
          Y: 'Yes, I was treated at a Non-VA hospital',
          N: 'No, I was not treated at a Non-VA hospital',
        },
        errorMessages: {
          required: 'Please select if you were treated at a Non-VA hospital.',
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
          expandUnderCondition: true,
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
          'view:treatmentAtNonVA': yesNoSchema,
          'view:nonVAAuthorizationInfo': {
            type: 'object',
            properties: {}
          },
        },
      },
    },
  },
};
