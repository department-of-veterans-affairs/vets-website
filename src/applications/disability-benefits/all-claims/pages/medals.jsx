import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { MedalsDescription } from '../content/medals';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': ({ formData }) => (
    <MedalsDescription formData={formData} index={index} formType="781" />
  ),
  [`medals${index}`]: {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
  },
  [`medalType${index}`]: {
    'ui:title': 'Please tell us what medal or citation you received. ',
    'ui:options': {
      expandUnder: `medals${index}`,
      expandUnderCondition: true,
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`medals${index}`]: {
      type: 'boolean',
      properties: {},
    },
    [`medalType${index}`]: {
      type: 'string',
    },
  },
});
