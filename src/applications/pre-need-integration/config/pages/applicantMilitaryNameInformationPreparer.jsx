import React from 'react';
import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import fullNameUI from 'platform/forms/definitions/fullName';

export const nonRequiredFullNameUI = omit('required', fullNameUI);

const { fullName } = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);
function suffixSpacing() {
  return <div className="suffixSpacing" />;
}

export const uiSchema = {
  application: {
    veteran: {
      'ui:description': <h3>Applicant’s previous name</h3>,
      serviceName: merge({}, nonRequiredFullNameUI, {
        first: {
          'ui:title': 'Applicant’s previous first name',
          'ui:webComponentField': VaTextInputField,
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        last: {
          'ui:title': 'Applicant’s previous last name',
          'ui:webComponentField': VaTextInputField,
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        middle: {
          'ui:title': 'Applicant’s previous middle name',
          'ui:webComponentField': VaTextInputField,
        },
        suffix: {
          'ui:title': 'Applicant’s previous suffix',
          'ui:webComponentField': VaSelectField,
          'ui:options': { classNames: 'form-select-medium' },
        },
      }),
      'view:suffixSpacing': {
        'ui:field': suffixSpacing,
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            serviceName: nonRequiredFullName,
            'view:suffixSpacing': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
