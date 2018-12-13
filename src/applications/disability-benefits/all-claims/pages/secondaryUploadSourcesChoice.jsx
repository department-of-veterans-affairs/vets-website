import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { uploadDescription } from '../content/secondaryUploadSourcesChoice';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': uploadDescription,
  [`view:uploadChoice${index}`]: {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:uploadChoice${index}`]: {
      type: 'boolean',
      properties: {},
    },
  },
});
