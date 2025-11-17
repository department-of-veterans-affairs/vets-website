import React from 'react';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  serviceNumberSchema,
  serviceNumberUI,
  ssnSchema,
  ssnUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { inlineTitleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI('Basic Information'),
      'ui:description': () => (
        <div style={{ paddingTop: '2rem' }}>
          We need to collect some basic information about you first.
        </div>
      ),
      'ui:order': [
        veteranFields.fullName,
        veteranFields.ssn,
        veteranFields.vaFileNumber,
        veteranFields.dateOfBirth,
        veteranFields.veteranServiceNumber,
      ],

      [veteranFields.fullName]: {
        ...fullNameUI(label => getFullNameLabels(label, false)),
      },
      [veteranFields.ssn]: ssnUI(),
      [veteranFields.vaFileNumber]: vaFileNumberUI(),
      [veteranFields.dateOfBirth]: dateOfBirthUI(),
      [veteranFields.veteranServiceNumber]: serviceNumberUI(
        'VA service number',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.fullName]: fullNameSchema,
          [veteranFields.vaFileNumber]: vaFileNumberSchema,
          [veteranFields.ssn]: ssnSchema,
          [veteranFields.dateOfBirth]: dateOfBirthSchema,
          [veteranFields.veteranServiceNumber]: serviceNumberSchema,
        },
        required: [
          veteranFields.fullName,
          veteranFields.ssn,
          veteranFields.dateOfBirth,
        ],
      },
    },
  },
};
