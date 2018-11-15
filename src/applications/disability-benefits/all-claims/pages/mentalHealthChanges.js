import React from 'react';

const mentalDescriptionChanges = (
  <div>
    <h5>Changes in mental health or substance abuse</h5>
    <p>
      Please tell us about any changes in your mental health as a result of the
      event(s). You may have experienced some or none of these. (Please check
      any that apply.)
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': mentalDescriptionChanges,
  mentalChanges: {
    depression: {
      'ui:title':
        'Episodes of depression, panic attacks, or anxiety without an identifiable cause',
    },
    obsessive: {
      'ui:title': 'Obsessive behaviors',
    },
    prescription: {
      'ui:title':
        'Increased or decreased use of prescription medications or over-the-counter medications',
    },
    substance: {
      'ui:title': 'Substance abuse such as alcohol or drugs',
    },
    hypervigillance: {
      'ui:title': 'Hypervigilance, heightened fight or flight response',
    },
    agoraphobia: {
      'ui:title': 'Staying at home, not wanting to go out, agoraphobia',
    },
    fear: {
      'ui:title':
        'Increased fear of surroundings, inability to go to certain areas',
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
      expandUnder: 'mentalChanges',
      expandUnderCondition: mentalChanges => mentalChanges.other === true,
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    mentalChanges: {
      type: 'object',
      properties: {
        depression: {
          type: 'boolean',
        },
        obsessive: {
          type: 'boolean',
        },
        prescription: {
          type: 'boolean',
        },
        substance: {
          type: 'boolean',
        },
        hypervigillance: {
          type: 'boolean',
        },
        agoraphobia: {
          type: 'boolean',
        },
        fear: {
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
