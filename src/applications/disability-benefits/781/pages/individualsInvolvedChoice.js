import React from 'react';
import { individualsInvolvedTitle } from '../helpers';

const individualsInvolvedChoiceDescription = () => (
  <p>
    Was anyone killed or injured, not including yourself, during this event?
  </p>
);

export const uiSchema = {
  'ui:title': individualsInvolvedTitle,
  'view:individualsInvolvedChoice': {
    'ui:description': individualsInvolvedChoiceDescription,
    'ui:title': individualsInvolvedChoiceDescription,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yesOne: 'Yes, one other person',
        yesMany: 'Yes, many people were killed or injured',
        no: 'No, nobody was killed or injured',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:individualsInvolvedChoice': {
      type: 'string',
      enum: ['yesOne', 'yesMany', 'no'],
    },
  },
};
