import React from 'react';

import { cloneDeep } from 'lodash';

import { fullNameNoSuffixUI } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern.js';
import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

const personFullNameUI = cloneDeep(fullNameNoSuffixUI());

personFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="custom-header">
        Tell us who we can release your information to.
      </h3>
    ),
    personFullName: personFullNameUI,
  },
  schema: {
    type: 'object',
    required: ['personFullName'],
    properties: {
      personFullName: pdfFullNameNoSuffixSchema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
    },
  },
};
