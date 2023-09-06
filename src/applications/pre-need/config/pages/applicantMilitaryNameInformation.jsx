import React from 'react';
import { merge } from 'lodash';
import get from 'platform/utilities/data/get';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';

import fullNameUI from 'platform/forms/definitions/fullName';

const { fullName } = fullSchemaPreNeed.definitions;

export const uiSchema = {
  application: {
    veteran: {
      'ui:description': () => {
        return <h3 className="vads-u-font-size--h5">Previous name</h3>;
      },
      serviceName: environment.isProduction()
        ? merge({}, fullNameUI, {
            first: {
              'ui:required': form =>
                get('application.veteran.view:hasServiceName', form) === true,
            },
            last: {
              'ui:required': form =>
                get('application.veteran.view:hasServiceName', form) === true,
            },
          })
        : merge({}, fullNameUI, {
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
            serviceName: fullName,
          },
        },
      },
    },
  },
};
