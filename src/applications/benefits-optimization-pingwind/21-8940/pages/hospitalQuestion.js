import React from 'react';
import {
  inlineTitleUI,
  yesNoSchema,
  yesNoUI,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { hospitalizationQuestionFields } from '../definitions/constants';

const hospitalTypeOptions = [
  { value: 'nonVa', label: 'Non-VA Hospital' },
  { value: 'va', label: 'VA Hospital' },
  { value: 'both', label: 'Both VA and Non-VA Hospital' },
];

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
      hospitalType: {
        ...radioUI({
          title: 'Where were you treated?',
          options: hospitalTypeOptions,
          errorMessages: {
            required: 'Please select if this is a VA or Non-VA hospital',
          },
        }),
        'ui:required': formData =>
          formData?.[hospitalizationQuestionFields.parentObject]?.[
            hospitalizationQuestionFields.hasBeenHospitalized
          ] === true,
        'ui:options': {
          hideIf: formData =>
            !formData?.[hospitalizationQuestionFields.parentObject]?.[
              hospitalizationQuestionFields.hasBeenHospitalized
            ],
        },
      },
      'view:nonVAAuthorizationInfo': {
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
          expandUnder: 'hospitalType',
          expandUnderCondition: val => val === 'nonVa' || val === 'both',
        },
      },

      'ui:options': {
        showFieldLabel: true,

        updateSchema: (formData, schema, _uiSchema, _index, _path) => {
          if (
            formData &&
            !formData[hospitalizationQuestionFields.hasBeenHospitalized]
          ) {
            return {
              ...schema,
              properties: {
                ...schema.properties,
                hospitalType: {
                  ...schema.properties?.hospitalType,
                  default: undefined,
                },
              },
            };
          }
          return schema;
        },
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
          hospitalType: {
            type: 'string',
            enum: hospitalTypeOptions.map(o => o.value),
            enumNames: hospitalTypeOptions.map(o => o.label),
          },
          'view:nonVAAuthorizationInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
