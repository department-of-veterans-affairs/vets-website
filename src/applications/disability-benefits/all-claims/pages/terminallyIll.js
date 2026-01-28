import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const TerminallyIllInfo = (
  <va-additional-info trigger="Why does this matter?">
    We can process your claim faster if a provider told you that you’re
    terminally ill. You’ll need to submit evidence at a later time.
  </va-additional-info>
);

export const uiSchema = {
  'ui:title': 'High Priority claims',
  isTerminallyIll: yesNoUI({
    title: 'Are you terminally ill?',
  }),
  'view:terminallyIllInfo': {
    'ui:description': TerminallyIllInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    isTerminallyIll: yesNoSchema,
    'view:terminallyIllInfo': {
      type: 'object',
      properties: {},
    },
  },
};
