// @ts-check
import React from 'react';
import {
  textUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  checkboxUI,
  checkboxRequiredSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Test name and date taken'),
    testName: {
      ...textUI({
        title: 'Name of test',
        required: () => true,
        errorMessages: {
          required: 'Enter the name of the test',
        },
      }),
    },
    testDate: {
      ...currentOrPastDateUI({
        title: 'Date test was taken',
        hint: "This date can't be in the future",
        required: () => true,
        errorMessages: {
          required: 'Enter the date you took the test',
        },
      }),
    },
    understandsUploadRequirement1: {
      ...checkboxUI({
        title: 'I understand',
        description: (
          <div>
            <p>
              When you submit this form on QuickSubmit or by mail, you will need
              to attach a copy of your test results to your submission. If you
              do not have any test results but have a copy of your license or
              certification that clearly displays your name, you can attach
              that.
            </p>
          </div>
        ),
        required: () => true,
        errorMessages: {
          required: 'Read the statement above and check the box below',
        },
      }),
      'ui:options': {
        classNames:
          'vads-u-padding--3 vads-u-margin-top--3 vads-u-background-color--gray-lightest',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      testName: {
        type: 'string',
      },
      testDate: currentOrPastDateSchema,
      understandsUploadRequirement1: checkboxRequiredSchema,
    },
    required: ['testName', 'testDate'],
  },
};
