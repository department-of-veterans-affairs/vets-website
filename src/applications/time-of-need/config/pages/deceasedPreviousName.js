import React from 'react';
import {
  textSchema,
  textUI,
  selectSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

const suffixOptions = [
  { value: '', label: 'Select suffix' },
  { value: 'Jr.', label: 'Jr.' },
  { value: 'Sr.', label: 'Sr.' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'IV', label: 'IV' },
  { value: 'V', label: 'V' },
  { value: 'Other', label: 'Other' },
];

export default {
  uiSchema: {
    'ui:description': <AutoSaveNotice />,
    'ui:title': 'Deceased’s previous name',
    previousFirstName: {
      ...textUI({
        title: 'Previous first name',
        errorMessages: { required: 'Previous first name is required' },
      }),
      'ui:required': () => true,
    },
    previousMiddleName: {
      ...textUI({
        title: 'Previous middle name',
      }),
      'ui:required': () => false,
    },
    previousLastName: {
      ...textUI({
        title: 'Previous last name',
        errorMessages: { required: 'Previous last name is required' },
      }),
      'ui:required': () => true,
    },
    previousSuffix: {
      ...selectUI({
        title: 'Previous suffix',
        options: suffixOptions,
      }),
      'ui:required': () => false,
    },
  },
  schema: {
    type: 'object',
    properties: {
      previousFirstName: textSchema,
      previousMiddleName: textSchema,
      previousLastName: textSchema,
      previousSuffix: selectSchema({ options: suffixOptions }),
    },
    required: ['previousFirstName', 'previousLastName'],
  },
};
