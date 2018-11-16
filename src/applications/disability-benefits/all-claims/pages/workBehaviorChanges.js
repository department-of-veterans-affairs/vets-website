import React from 'react';

const workDescriptionChanges = (
  <div>
    <h5>Changes in Behavior at work</h5>
    <p>
      Please tell us about any issue you had at work as a result of the
      event(s). You may have experienced some or none of these. (Please check
      any that apply.)
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ' ',
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
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
  otherExplanation: {
    'ui:title': 'Please specify',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      maxLength: 32000,
      expandUnder: 'workBehaviorChanges',
      expandUnderCondition: workBehaviorChanges =>
        workBehaviorChanges.other === true,
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
        noneApply: {
          type: 'boolean',
        },
      },
    },
    otherExplanation: {
      type: 'string',
    },
  },
};
