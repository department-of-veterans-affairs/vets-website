import React from 'react';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderOptions } from '../helpers';
import AddEligibileStudents from '../components/AddEligibileStudents';

const uiSchema = {
  'view:descriptionText': {
    'ui:description': () => <AddEligibileStudents />,
  },
  'view:yellowRibbonProgramRequestSummary': arrayBuilderYesNoUI(
    arrayBuilderOptions,
    {
      title: 'Do you have another Yellow Ribbon Program contribution to add?',
      labels: {
        Y: 'Yes, I want to add another contribution ',
        N: "No, I don't have another contribution to add",
      },
      hint: '',
      errorMessages: {
        required: 'Select yes if you have another contribution to add',
      },
    },
    {
      title: 'Do you have another Yellow Ribbon Program contribution to add?',
      labels: {
        Y: 'Yes, I want to add another contribution ',
        N: "No, I don't have another contribution to add",
      },
      errorMessages: {
        required: 'Select yes if you have another contribution to add',
      },
    },
  ),
};

const schema = {
  type: 'object',
  properties: {
    'view:descriptionText': {
      type: 'string',
    },
    'view:yellowRibbonProgramRequestSummary': arrayBuilderYesNoSchema,
  },
  required: ['view:yellowRibbonProgramRequestSummary'],
};

export { uiSchema, schema };
