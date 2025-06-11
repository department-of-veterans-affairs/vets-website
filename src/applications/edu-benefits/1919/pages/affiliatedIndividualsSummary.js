import React from 'react';

import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { affiliatedIndividualsArrayOptions, alert } from '../helpers';

const summaryPage = {
  uiSchema: {
    'view:introduction': {
      ...titleUI('Individuals with a potential conflict of interest'),
      'ui:description': (
        <>
          <div data-testid="instructions">
            <p>
              Title 38 U.S.C. 3638 prohibits employees of the Department of
              Veterans Affairs (VA) and the State Approving Agency (SAA) from
              owning any interest in a for-profit educational institution. These
              employees cannot receive wages, salary, dividends, profits, or
              gifts from for-profit schools. The law also prohibits VA employees
              from receiving any services from these schools. The VA may waive
              these restrictions if it determines that no harm will result to
              the government, Veterans, or eligible persons.
            </p>
            <p>
              In the next step, you’ll provide information about any VA or SAA
              employees who may have a conflict under this law.
            </p>
          </div>
          {alert}
        </>
      ),
      'ui:options': {
        hideIf: formData => formData?.affiliatedIndividuals?.length > 0,
      },
    },
    isProfitConflictOfInterest: arrayBuilderYesNoUI(
      affiliatedIndividualsArrayOptions,
      {
        title:
          'Do you need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        hint: () => '',
      },
      {
        title:
          'Do you have another individual with a potential conflict of interest to add?',
        labels: {
          Y: 'Yes, I have another individual to report',
          N: "No, I don't have another individual to report",
        },
        hint: () => '',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': {
        type: 'object',
        properties: {},
      },
      isProfitConflictOfInterest: arrayBuilderYesNoSchema,
    },
    required: ['isProfitConflictOfInterest'],
  },
};

export { summaryPage as affiliatedIndividualsSummary };
