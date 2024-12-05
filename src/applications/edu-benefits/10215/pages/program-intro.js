import React from 'react';
import {
  numberUI,
  textUI,
  textSchema,
  numberSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import Calcs from './calcs';

export const programInfo = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Program Information',
      nounSingular: 'program',
    }),
    'ui:description': (
      <va-link
        href=""
        text="Review the calculation instructions (opens in a new tab)"
      />
    ),
    programName: textUI('Program name'),
    studentsEnrolled: numberUI({
      title: 'Total number of students enrolled',
    }),
    supportedStudents: numberUI({
      title: 'Total number of supported students enrolled',
    }),
    fte: {
      'ui:description': (
        <p>
          <strong>Note: </strong>
          If there are fewer than 10 supported students enrolled in this
          program, you do not have to fill out the information below, and the
          Total enrolled FTE And supported student percentage FTE will not be
          calculated or submitted.
        </p>
      ),
      supported: numberUI({
        title: 'Number of supported students FTE',
      }),
      nonSupported: numberUI({
        title: 'Number of non-supported students FTE',
      }),
    },
    'view:calcs': {
      'ui:description': Calcs,
    },
  },
  schema: {
    type: 'object',
    properties: {
      programName: textSchema,
      studentsEnrolled: numberSchema,
      supportedStudents: numberSchema,
      fte: {
        type: 'object',
        properties: {
          supported: numberSchema,
          nonSupported: numberSchema,
        },
      },
      'view:calcs': { type: 'object', properties: {} },
    },
    required: ['programName', 'studentsEnrolled', 'supportedStudents'],
  },
};
