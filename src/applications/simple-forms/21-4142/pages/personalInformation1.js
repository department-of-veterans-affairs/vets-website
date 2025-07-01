import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import { intersection, pick } from 'lodash';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [veteranFields.parentObject]: {
          'ui:title': (
            <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
              Tell us about the Veteran connected to this authorization
            </h3>
          ),
          [veteranFields.fullName]: fullNameDeprecatedUI,
          [veteranFields.dateOfBirth]: dateUI('Date of birth'),
        },
      }
    : {
        [veteranFields.parentObject]: {
          ...titleUI({
            title: 'Tell us about the Veteran connected to this authorization',
          }),
          [veteranFields.fullName]: fullNameUI(label =>
            getFullNameLabels(label, false),
          ),
          [veteranFields.dateOfBirth]: dateOfBirthUI(),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [veteranFields.parentObject]: {
            type: 'object',
            required: intersection(required, pageFields),
            properties: pick(properties, pageFields),
          },
        }
      : {
          [veteranFields.parentObject]: {
            type: 'object',
            properties: {
              [veteranFields.fullName]: fullNameSchema,
              [veteranFields.dateOfBirth]: dateOfBirthSchema,
            },
            required: ['fullName', 'dateOfBirth'],
          },
        },
  },
};
