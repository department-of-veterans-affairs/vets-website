// import React from 'react';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Tell us about the Veteran connected to this authorization',
      headerLevel: 3,
    }),
    fullName: fullNameUI(label => getFullNameLabels(label, false)),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
