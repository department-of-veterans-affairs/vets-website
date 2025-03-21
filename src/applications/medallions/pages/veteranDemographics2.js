import React from 'react';

import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

const ethnicityLabels = {
  HL: 'Hispanic or Latino',
  NHL: 'Not Hispanic or Latino',
  NA: 'Prefer not to answer',
};

const raceLabels = {
  isAmericanIndianOrAlaskanNative: 'American Indian or Alaskan Native',
  isAsianOrAsianAmerican: 'Asian or Asian American',
  isBlackOrAfricanAmerican: 'Black or African American',
  isNativeHawaiianOrOtherPacificIslander:
    'Native Hawaiian or other Pacific Islanders',
  isWhite: 'White',
  NA: 'Prefer not to answer',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran demographics',
      <div className="description">
        We use this information for statistical purposes only. Your answers
        won’t affect your application.
        <br />
        <br />
        If you no longer want to answer these questions, select{' '}
        <b>Prefer not to answer</b>.
      </div>,
    ),
    ethnicity: {
      ...radioUI({
        title: 'What’s the Veteran’s ethnicity?',
        labels: ethnicityLabels,
      }),
    },
    originRace: merge(
      {},
      checkboxGroupUI({
        title: 'What’s the Veteran’s race?',
        description: (
          <p className="vads-u-margin-top--0  vads-u-color--gray-medium">
            You can select more than 1 option
          </p>
        ),
        required: false,
        labels: raceLabels,
      }),
      {
        'ui:validations': [
          // custom validation to ensure that "Prefer not to answer" is not selected along with other options
          (errors, fields) => {
            const { NA, ...otherFields } = fields;
            const otherSelected = Object.values(otherFields).some(
              val => val === true,
            );

            if (NA && otherSelected) {
              errors.addError(
                'When selecting Prefer not to answer, you can’t have another option.',
              );
            }
          },
        ],
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      ethnicity: radioSchema(Object.keys(ethnicityLabels)),
      originRace: checkboxGroupSchema(Object.keys(raceLabels)),
    },
    required: ['veteranDemoYesNo'],
  },
};
