import React from 'react';
import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import fullNameUI from 'platform/forms/definitions/fullName';

export const nonRequiredFullNameUI = omit('required', fullNameUI);

const { fullName } = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);

export const uiSchema = {
  application: {
    veteran: {
      'ui:description': <h3 className="vads-u-font-size--h5">Previous name</h3>,
      serviceName: merge({}, nonRequiredFullNameUI, {
        first: {
          'ui:title': 'Your previous first name',
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        last: {
          'ui:title': 'Your previous last name',
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        middle: {
          'ui:title': 'Your previous middle name',
        },
        suffix: {
          'ui:title': 'Your previous suffix',
        },
      }),
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
          },
        },
      },
    },
  },
};
