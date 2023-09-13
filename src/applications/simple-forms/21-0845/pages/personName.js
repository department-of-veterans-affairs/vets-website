import React from 'react';

import { cloneDeep } from 'lodash';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

const personFullNameUI = cloneDeep(fullNameUI);

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
      personFullName: schema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
    },
  },
};
