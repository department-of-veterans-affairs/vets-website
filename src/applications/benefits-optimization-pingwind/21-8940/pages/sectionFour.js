import React from 'react';

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Education and Training Information
      </h3>
    ),
    'ui:description': 'Please provide information about your education level.',

    educationLevel: radioUI({
      title: 'Select the highest level of education that you have completed',
      labels: {
        gradeSchool: 'Grade School',
        highSchool: 'High School',
        college: 'College',
      },
    }),

    gradeSchool: {
      ...radioUI({
        title: 'What is the highest grade school level you completed?',
        labels: {
          '1': '1st Grade',
          '2': '2nd Grade',
          '3': '3rd Grade',
          '4': '4th Grade',
          '5': '5th Grade',
          '6': '6th Grade',
          '7': '7th Grade',
          '8': '8th Grade',
        },
        hideIf: formData => formData.educationLevel !== 'gradeSchool',
      }),
      'ui:required': formData => formData.educationLevel === 'gradeSchool',
    },

    highSchool: {
      ...radioUI({
        title: 'What is the highest high school level you completed?',
        labels: {
          '9': '9th Grade',
          '10': '10th Grade',
          '11': '11th Grade',
          '12': '12th Grade',
        },
        hideIf: formData => formData.educationLevel !== 'highSchool',
      }),
      'ui:required': formData => formData.educationLevel === 'highSchool',
    },

    college: {
      ...radioUI({
        title: 'What is the highest college level you completed?',
        labels: {
          freshman: 'College Freshman',
          sophomore: 'College Sophomore',
          junior: 'College Junior',
          senior: 'College Senior',
        },
        hideIf: formData => formData.educationLevel !== 'college',
      }),
      'ui:required': formData => formData.educationLevel === 'college',
    },
  },
  schema: {
    type: 'object',
    required: ['educationLevel'],
    properties: {
      educationLevel: radioSchema(['gradeSchool', 'highSchool', 'college']),
      gradeSchool: radioSchema(['1', '2', '3', '4', '5', '6', '7', '8']),
      highSchool: radioSchema(['9', '10', '11', '12']),
      college: radioSchema(['freshman', 'sophomore', 'junior', 'senior']),
    },
  },
};
