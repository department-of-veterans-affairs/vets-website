import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { officialsArrayOptions } from '../helpers';

export default {
  uiSchema: {
    'view:hasAdditionalOfficials': arrayBuilderYesNoUI(
      officialsArrayOptions,
      {
        title:
          'Do you have a faculty member, school official, or governing member to add?',
        labelHeaderLevel: 'p',
        labels: {
          Y: 'Yes, I have a faculty member to add.',
          N: 'No, I do not have a faculty member to add.',
        },
        hint: '',
        errorMessages: {
          required: 'Select ‘yes’ if you have an official to add',
        },
      },
      {
        title:
          'Do you have an additional faculty member, school official, or governing member to add?',
        labelHeaderLevel: 'p',
        labels: {
          Y: 'Yes, I have a faculty member to add.',
          N: 'No, I do not have a faculty member to add.',
        },
        hint: '',
        errorMessages: {
          required: 'Select ‘yes’ if you have another official to add',
        },
      },
    ),
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasAdditionalOfficials': arrayBuilderYesNoSchema,
    },
    required: ['view:hasAdditionalOfficials'],
  },
};
