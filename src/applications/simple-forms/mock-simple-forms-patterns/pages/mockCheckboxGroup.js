import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('V3 Web component checkbox group'),
    checkboxGroupAtLeastOneRequired: checkboxGroupUI({
      title: 'Checkbox group - At least one required',
      required: true,
      description: (
        <va-additional-info trigger="JSX description">
          We need the Veteran’s Social Security number or tax identification
          number to process the application when it’s submitted online, but it’s
          not a requirement to apply for the program.
        </va-additional-info>
      ),
      hint: 'This is hint text',
      labels: {
        hasA: 'Option A',
        hasB: 'Option B',
      },
    }),
    checkboxGroupAllOptional: checkboxGroupUI({
      title: 'Checkbox group - All optional',
      required: false,
      hint: 'This is hint text',
      labels: {
        hasA: 'Option A',
        hasB: 'Option B',
      },
    }),
    checkboxGroupTiledWithCustomErrorMessage: checkboxGroupUI({
      title: 'Checkbox group - Tiled with a custom error message',
      required: true,
      tile: true,
      labels: {
        hasA: {
          title: 'Option A',
          description: 'Select this option if you want to do option A',
        },
        hasB: {
          title: 'Option B',
          description: 'Select this option if you want to do option B',
        },
      },
      errorMessages: {
        required: 'Please select option A or option B',
      },
    }),
    checkboxGroupTiledWithHeaderLabel: checkboxGroupUI({
      title: 'Checkbox group tiled - Custom header',
      description: 'Please select at least one option',
      labelHeaderLevel: '3',
      required: true,
      tile: true,
      labels: {
        hasA: {
          title: 'Option A',
          description: 'Select this option if you want to do option A',
        },
        hasB: {
          title: 'Option B',
          description: 'Select this option if you want to do option B',
        },
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      checkboxGroupAtLeastOneRequired: checkboxGroupSchema(['hasA', 'hasB']),
      checkboxGroupAllOptional: checkboxGroupSchema(['hasA', 'hasB']),
      checkboxGroupTiledWithCustomErrorMessage: checkboxGroupSchema([
        'hasA',
        'hasB',
      ]),
      checkboxGroupTiledWithHeaderLabel: checkboxGroupSchema(['hasA', 'hasB']),
    },
    required: [
      'checkboxGroupAtLeastOneRequired',
      'checkboxGroupTiledWithCustomErrorMessage',
      'checkboxGroupTiledWithHeaderLabel',
    ],
  },
};
