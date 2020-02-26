import { genericSchemas } from '../../../generic-schema';
import { suffixes } from '../../../constants';
import React from 'react';
import _ from 'lodash/fp';

export const schema = {
  type: 'object',
  properties: {
    stepChildren: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'view:stillSupportingStepchild': {
            type: 'boolean',
          },
        },
      },
    },
  },
}

export const uiSchema = {
  stepChildren: {  
    items: {
      'ui:options': {
        updateSchema: function(form, schema, uiSchema, index) {
          console.log(form);
        },
      },
      'view:stillSupportingStepchild': {
        'ui:widget': 'yesNo',
        'ui:title': 'Are you still supporting this child?',
      },
    },
  },
},
