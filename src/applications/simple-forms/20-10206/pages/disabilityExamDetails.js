import React from 'react';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation.js';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { DisabilityExamDate } from '../components/viewElements';

const dateUiTitle = 'When was your exam?';
/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Disability exam details',
      'You requested access to your disability examinations (C&P exams). Any extra information you can share will help us find your records.',
    ),
    disabilityExams: {
      'ui:options': {
        itemName: 'exam',
        viewField: DisabilityExamDate,
        keepInPageOnReview: true,
        customTitle: ' ',
        useDlWrap: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        disabilityExamDate: {
          'ui:title': dateUiTitle,
          'ui:webComponentField': VaMemorableDateField,
          'ui:validations': [validateCurrentOrPastMemorableDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid exam date',
            required: 'Please enter your exam date',
          },
          'ui:options': {
            hint: 'It’s OK to estimate.',
            invalidDay: false,
          },
          'ui:reviewField': ({ children }) => (
            <div className="review-row">
              <dt>{dateUiTitle}</dt>
              <dd>
                {children.props.formData && (
                  <>
                    {new Date(
                      `${children.props.formData}T00:00:00`,
                    ).toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </>
                )}
              </dd>
            </div>
          ),
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabilityExams: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            disabilityExamDate: commonDefinitions.date,
          },
        },
      },
    },
  },
};
