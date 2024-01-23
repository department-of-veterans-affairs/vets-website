import React from 'react';
import { cloneDeep } from 'lodash';

import { fullNameNoSuffixUI } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern.js';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

const fullNameUI = cloneDeep(fullNameNoSuffixUI());

fullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: Use ...titleUI() once that supports functions for title
    'ui:title': ({ formData }) => {
      switch (formData.preparerType) {
        case 'third-party-veteran':
          return <h3>Veteran’s name and date of birth</h3>;
        case 'third-party-non-veteran':
          return <h3>Claimant’s name and date of birth</h3>;
        default:
          return <h3>Your name and date of birth</h3>;
      }
    },
    fullName: fullNameUI,
    dateOfBirth: dateOfBirthUI(),
    updateSchemaAndData: () => {},
  },
  schema: {
    type: 'object',
    properties: {
      fullName: pdfFullNameNoSuffixSchema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
