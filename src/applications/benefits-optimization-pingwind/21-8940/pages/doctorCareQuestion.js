import React from 'react';
import {
  inlineTitleUI,
  yesNoSchema,
  yesNoUI,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const doctorCareTypeOptions = [
  { value: 'nonVa', label: 'Non-VA Doctor' },
  { value: 'va', label: 'VA Doctor' },
  { value: 'both', label: 'Both VA and Non-VA Doctor' },
];

import { doctorCareQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [doctorCareQuestionFields.parentObject]: {
      ...inlineTitleUI(
        'Recent Medical Care',
        'Tell us more about the doctors treating you and when.',
      ),
      [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoUI({
        title: "Have you been under a doctor's care for the past 12 months?",
        labels: {
          Y: "Yes, I have been under a doctor's care in the past 12 months",
          N: "No, I have NOT been under a doctor's care in the past 12 months",
        },
      }),
      doctorCareType: {
        ...radioUI({
          title: 'What type of doctor(s) treated you?',
          options: doctorCareTypeOptions,
          errorMessages: {
            required: 'Please select if this is a VA or Non-VA doctor',
          },
        }),
        'ui:required': formData =>
          formData?.[doctorCareQuestionFields.parentObject]?.[
            doctorCareQuestionFields.hasReceivedDoctorCare
          ] === true,
        'ui:options': {
          hideIf: formData =>
            !formData?.[doctorCareQuestionFields.parentObject]?.[
              doctorCareQuestionFields.hasReceivedDoctorCare
            ],
        },
      },
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
          expandUnder: 'doctorCareType',
          expandUnderCondition: val => val === 'nonVa' || val === 'both',
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
          doctorCareType: {
            type: 'string',
            enum: doctorCareTypeOptions.map(o => o.value),
            enumNames: doctorCareTypeOptions.map(o => o.label),
          },
          'view:doctorCareTypeDescription': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
