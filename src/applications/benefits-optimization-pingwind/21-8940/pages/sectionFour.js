import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section IV: Schooling and Other Training'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">
            <b>What to expect:</b>
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Highest level of education completed</li>
              <li>
                Details about any education and training before or after
                becoming too disabled to work
              </li>
              <li>Dates of education or training</li>
              <li>Takes about 3-5 minutes</li>
            </ul>
          </div>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <h2 style={{ marginTop: 0 }}>Education Level</h2>
          <p>Your education background</p>
        </div>
      </div>
    ),

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
      'ui:errorMessages': {
        required: 'Please select your grade school level to proceed',
      },
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

      'ui:errorMessages': {
        required: 'Please select your high school grade level to proceed',
      },
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

      'ui:errorMessages': {
        required: 'Please select your college level to proceed',
      },
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
