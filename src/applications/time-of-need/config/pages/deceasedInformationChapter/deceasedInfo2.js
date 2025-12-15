// import React from 'react';
import {
  titleUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const deceasedInfo2 = {
  uiSchema: {
    ...titleUI('Deceased Veteran details'),
    dateOfBirth: {
      ...dateOfBirthUI({
        title: 'Date of Birth',
        description: 'For example: January 19 2000',
      }),
      'ui:options': {
        useV3: true,
      },
    },
    dateOfDeath: {
      ...dateOfBirthUI({
        title: 'Date of death',
        description: 'For example: January 19 2000',
      }),
      'ui:options': {
        useV3: true,
      },
    },
    ssn: {
      ...ssnUI(),
      'ui:title': 'Social Security Number',
      'ui:options': {
        useV3: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfBirth', 'dateOfDeath', 'ssn'],
    properties: {
      dateOfBirth: {
        ...dateOfBirthSchema,
        title: 'Date of Birth',
      },
      dateOfDeath: {
        ...dateOfBirthSchema,
        title: 'Date of death',
      },
      ssn: {
        ...ssnSchema,
        title: 'Social Security Number',
      },
    },
  },
};

export default deceasedInfo2;
