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
    'view:fewerThan10Alert': {
      'ui:description': (
        <va-alert status="info" uswds visible>
          <h3 slot="headline">Fewer than 10 supported students</h3>
          <p>
            <strong>Note:</strong> This program has fewer than 10 supported
            students. You don’t need to enter any additional information,{' '}
            <strong>
              but please continue adding this program so it’s included in your
              report.
            </strong>
          </p>
          <p>
            If you entered this number in error, you can go back and adjust it
            now.
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: (formData, index) => {
          const value = getSupportedStudents(formData, index);
          return (!value || value >= 10) && value !== 0;
        },
      },
    },
    fte: {
      'view:fteNote': {
        'ui:description': (
          <p>
            <strong>Note: </strong>
            If there are fewer than 10 supported students enrolled in this
            program, you do not have to fill out the information below, and the
            Total enrolled FTE and supported student percentage FTE will not be
            calculated or submitted.
          </p>
        ),
        'ui:options': {
          hideIf: (formData, index) =>
            getSupportedStudents(formData, index) < 10,
        },
      },
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
          'ui:options': {
            hideIf: (formData, index) =>
              getSupportedStudents(formData, index) < 10,
          },
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
          'ui:options': {
            hideIf: (formData, index) =>
              getSupportedStudents(formData, index) < 10,
          },
        },
      ),
    },
    'view:calcs': {
      'ui:description': Calcs,
      'ui:options': {
        hideIf: (formData, index) => getSupportedStudents(formData, index) < 10,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      programName: { ...textSchema, pattern: noSpaceOnlyPattern },
      studentsEnrolled: numberSchema,
      supportedStudents: numberSchema,
      'view:fewerThan10Alert': { type: 'object', properties: {} },
      fte: {
        type: 'object',
        properties: {
          'view:fteNote': { type: 'object', properties: {} },
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
