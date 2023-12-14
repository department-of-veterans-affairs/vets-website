import React from 'react';

import moment from 'moment';

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
        itemName: 'Exam date',
        itemAriaLabel: formData => {
          const friendlyDateString = moment(
            formData.disabilityExamDate,
            'YYYY-MM-DD',
          ).format('LL');
          return `Exam Date for ${friendlyDateString}`;
        },
        viewField: DisabilityExamDate,
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        confirmRemoveDescription:
          'This will remove the date of your disability exam and may make it harder to find your record.',
        useDlWrap: true,
        showSave: true,
        reviewMode: true,
        reviewItemHeaderLevel: '4',
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
        maxItems: 5,
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
