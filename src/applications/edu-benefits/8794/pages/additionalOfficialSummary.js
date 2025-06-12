import React from 'react';
import {
  descriptionUI,
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  text: {
    getItemName: item => item.programName,
  },
};

const additionalOfficialSummary = {
  uiSchema: {
    ...titleUI('Add additional certifying officials'),
    ...descriptionUI(
      <>
        <p>
          In this next section of the form, please list any additional
          certifying officials at your institution. Officials listed in this
          section of the form are designated to sign VA Enrollment
          Certifications, Certifications of Change in Student Status,
          Certifications of Delivery of Advance Payments, Certifications of
          Pursuit, Attendance, Flight Training, On-the-Job or Apprenticeship
          Training (as applicable), School Portion of VA Form 22-1990t and other
          Certifications of Enrollment.
        </p>
        <va-alert status="info" visible>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            <strong>Note:</strong> All certifying officials at your institution
            must be listed on this form. This submission will replace any
            previously provided list of certifying officials.{' '}
            <strong>
              If any information in this form changes, you must submit a new,
              updated form.
            </strong>
          </p>
        </va-alert>
      </>,
    ),
    'view:additionalOfficialSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have any additional certifying officials to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: { 'view:additionalOfficialSummary': arrayBuilderYesNoSchema },
    required: ['view:additionalOfficialSummary'],
  },
};

export { additionalOfficialSummary };
