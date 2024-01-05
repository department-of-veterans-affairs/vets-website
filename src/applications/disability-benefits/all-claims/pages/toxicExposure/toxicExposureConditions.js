import React from 'react';
import {
  conditionsDescription,
  conditionsTitle,
} from '../../content/toxicExposure';
import { makeSchemaForNewDisabilities } from '../../utils/schemas';

export const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-font-size--h4 vads-u-margin--0">Toxic Exposure</h3>
  ),
  toxicExposureConditions: {
    'ui:title': conditionsTitle,
    'ui:description': conditionsDescription,
    'ui:options': {
      hideDuplicateDescription: true,
      showFieldLabel: true,
      updateSchema: makeSchemaForNewDisabilities,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposureConditions: {
      type: 'object',
      properties: {},
    },
  },
};
