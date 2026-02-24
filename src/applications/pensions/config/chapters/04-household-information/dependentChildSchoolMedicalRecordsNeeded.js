import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showMultiplePageResponse } from '../../../helpers';
import { getDependentChildTitle, dependentIsDisabled } from './helpers';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

export default {
  title: item => getDependentChildTitle(item, 'medical records needed'),
  path:
    'household/dependents/children/information/disabled-medical-records-needed/:index',
  depends: (formData, index) =>
    !showMultiplePageResponse() && dependentIsDisabled(formData, index),
  showPagePerItem: true,
  arrayPath: 'dependents',
  uiSchema: {
    dependents: {
      items: {
        ...titleUI(
          createHouseholdMemberTitle('fullName', 'medical records needed'),
          <>
            <p>
              You’ll need to submit medical records that show the child became
              permanently disabled because of a physical or mental disability
              before their 18th birthday.
            </p>
            <p>You can submit these types of medical records:</p>
            <ul>
              <li>Doctor's reports</li>
              <li>Medical labs</li>
              <li>Test results</li>
            </ul>
            <p>
              We’ll give you instructions for submitting your evidence at the
              end of this application.
            </p>
          </>,
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'view:disabledMedicalRecordsNeeded': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
