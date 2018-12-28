import React from 'react';

import { ptsd781aNameTitle } from '../content/ptsdClassification';

const workDescriptionChanges = (
  <div>
    <h5>Changes in behavior at work</h5>
    <p>
      Please tell us about any issue you had at work as a result of the
      event(s). You may have experienced some or none of these. (Please check
      any that apply.)
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': workDescriptionChanges,
  workBehaviorChanges: {
    changeAssignment: {
      'ui:title':
        'Sudden requests for a change in occupational series or duty assignment',
    },
    increasedLeave: {
      'ui:title': 'Increased use of leave',
    },
    withoutLeave: {
      'ui:title': 'AWOL - Absent without leave',
    },
    performanceChanges: {
      'ui:title': 'Changes in performance and performance evaluations',
    },
    economicChanges: {
      'ui:title': 'Economic changes',
    },
    resign: {
      'ui:title': 'Resigning from your job',
    },
    other: {
      'ui:title': 'Other',
    },
    otherExplanation: {
      'ui:title': ' ',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        expandUnder: 'other',
      },
    },
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    workBehaviorChanges: {
      type: 'object',
      properties: {
        changeAssignment: {
          type: 'boolean',
        },
        increasedLeave: {
          type: 'boolean',
        },
        withoutLeave: {
          type: 'boolean',
        },
        performanceChanges: {
          type: 'boolean',
        },
        economicChanges: {
          type: 'boolean',
        },
        resign: {
          type: 'boolean',
        },
        other: {
          type: 'boolean',
        },
        otherExplanation: {
          type: 'string',
        },
        noneApply: {
          type: 'boolean',
        },
      },
    },
  },
};
