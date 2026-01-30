import React from 'react';
import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s dependent children'),
    veteranChildrenCount: {
      ...numberUI({
        title: 'How many dependent children of the Veteran are there?',
        min: 0,
        max: 99,
      }),
    },
    'view:dependentChildInfo': {
      'ui:description': (
        <va-additional-info trigger="Who we consider a dependent child">
          <p>
            In most circumstances, children over the age of 23 aren’t considered
            dependent for VA purposes, unless the child is determined to be
            seriously disabled based on a condition that started before turning
            18.
          </p>
        </va-additional-info>
      ),
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranChildrenCount'],
    properties: {
      veteranChildrenCount: numberSchema,
      'view:dependentChildInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
