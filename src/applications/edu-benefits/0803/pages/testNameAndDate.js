// @ts-check
import React from 'react';
import {
  textUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
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
        monthSelect: false,
      }),
    },
    'view:understandsUploadRequirement1': {
      'ui:description': (
        <va-alert tabindex="0">
          When you submit this form on QuickSubmit or by mail, you will need to
          attach a copy of your test results to your submission. If you do not
          have any test results but have a copy of your license or certification
          that clearly displays your name, you can attach that.
        </va-alert>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      testName: {
        type: 'string',
      },
      testDate: currentOrPastDateSchema,
      'view:understandsUploadRequirement1': { type: 'object', properties: {} },
    },
    required: ['testName', 'testDate'],
  },
};
