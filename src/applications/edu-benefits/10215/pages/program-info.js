import React from 'react';
import _ from 'lodash';
import {
  numberUI,
  textUI,
  textSchema,
  numberSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import Calcs from './calcs';

const programInfo = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Program Information',
      nounSingular: 'program',
      nounPlural: 'programs',
    }),
    'ui:description': (
      <va-link
        external
        href="/education/apply-for-education-benefits/application/10215/calculation-instructions"
        text="Review the calculation instructions"
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
          Total enrolled FTE and supported student percentage FTE will not be
          calculated or submitted.
        </p>
      ),
      supported: _.merge(numberUI('Number of supported students FTE'), {
        'ui:required': (formData, _index) =>
          Number(formData?.programs?.[_index]?.supportedStudents) >= 10,
      }),
      nonSupported: _.merge(numberUI('Number of non-supported students FTE'), {
        'ui:required': (formData, _index) =>
          Number(formData?.programs?.[_index]?.supportedStudents) >= 10,
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

export { programInfo };
