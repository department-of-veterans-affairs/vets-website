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
import { decimalSchema } from '../helpers';

/**
 * On the review page, the *formData* contains a single *program*
 * object at the top-level when editing an existing program.
 */
const getSupportedStudents = (formData, index) =>
  Number(
    formData?.programs?.[index]?.supportedStudents ||
      formData?.supportedStudents,
  );
const noSpaceOnlyPattern = '^(?!\\s*$).+';
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
        href="/school-administrators/85-15-rule-enrollment-ratio/calculation-instructions"
        text="Review the calculation instructions"
      />
    ),
    programName: textUI({
      title: 'Program name',
      errorMessages: {
        required: 'Please enter a program name',
        pattern: 'You must provide a response',
      },
    }),
    studentsEnrolled: numberUI({
      title: 'Total number of students enrolled',
      errorMessages: {
        required:
          'Please enter the total number of students enrolled in the program',
      },
    }),
    supportedStudents: numberUI({
      title: 'Total number of supported students enrolled',
      errorMessages: {
        required:
          'Please enter the total number of supported students enrolled in the program',
      },
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
      supported: _.merge(
        numberUI({
          title: 'Number of supported students FTE',
          errorMessages: {
            required: 'Please enter the number of supported students FTE',
          },
        }),
        {
          'ui:required': (formData, index) =>
            getSupportedStudents(formData, index) >= 10,
        },
      ),
      nonSupported: _.merge(
        numberUI({
          title: 'Number of non-supported students FTE',
          errorMessages: {
            required: 'Please enter the number of non-supported students FTE',
          },
        }),
        {
          'ui:required': (formData, index) =>
            getSupportedStudents(formData, index) >= 10,
        },
      ),
    },
    'view:calcs': {
      'ui:description': Calcs,
    },
  },
  schema: {
    type: 'object',
    properties: {
      programName: { ...textSchema, pattern: noSpaceOnlyPattern },
      studentsEnrolled: numberSchema,
      supportedStudents: numberSchema,
      fte: {
        type: 'object',
        properties: {
          supported: decimalSchema,
          nonSupported: decimalSchema,
        },
      },
      'view:calcs': { type: 'object', properties: {} },
    },
    required: ['programName', 'studentsEnrolled', 'supportedStudents'],
  },
};

export { programInfo };
