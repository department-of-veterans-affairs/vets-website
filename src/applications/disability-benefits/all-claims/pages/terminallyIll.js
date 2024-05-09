import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const TerminallyIllInfo = (
  <va-additional-info trigger="Why does this matter?">
    We’ll help to get your claim processed faster if the evidence to support
    your claim shows that you’re terminally ill. Being terminally ill means
    you’re sick with an illness that can’t be cured and will likely result in
    death within a short period of time.
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
