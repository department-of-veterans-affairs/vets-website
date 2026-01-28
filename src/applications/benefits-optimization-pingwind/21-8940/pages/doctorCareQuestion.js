import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { doctorCareQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [doctorCareQuestionFields.parentObject]: {
      ...titleUI(
        'Recent Medical Care',
        'Tell us more about the doctors treating you and when.',
      ),
      [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoUI({
        title: "Have you been under a doctor's care for the past 12 months?",
        labels: {
          Y: "Yes, I have been under a doctor's care in the past 12 months",
          N: "No, I have NOT been under a doctor's care in the past 12 months",
        },
        errorMessages: {
          required:
            'Select a response to tell us if you have been under a doctor’s care in the last year.',
        },
      }),
      'view:doctorCareTypeDescription': {
        'ui:description': () => (
          <div>
            <p>
              <strong>Important:</strong> Use these forms to authorize the
              release of information to VA. Select the links to complete these
              forms in the online portal.
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
              These forms allow VA to request your medical records from non-VA
              healthcare providers.
            </p>
          </div>
        ),
        'ui:options': {
          expandUnder: doctorCareQuestionFields.hasReceivedDoctorCare,
          expandUnderCondition: true,
        },
      },
      'ui:options': {
        showFieldLabel: true,
        classNames: 'confirmation-required-radio',
        hideDuplicateDescription: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [doctorCareQuestionFields.parentObject]: {
        type: 'object',
        required: [doctorCareQuestionFields.hasReceivedDoctorCare],
        properties: {
          [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoSchema,
          'view:doctorCareTypeDescription': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
