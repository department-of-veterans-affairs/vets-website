import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Terminally Ill page for VA Form 21-0966 (Disability Benefits Claim).
 *
 * This page asks if the veteran is terminally ill to help prioritize
 * their disability claim processing.
 */

const TerminallyIllInfo = (
  <va-additional-info trigger="Why does this matter?">
    We can process your claim faster if a provider told you that you’re
    terminally ill. You’ll need to submit evidence at a later time.
  </va-additional-info>
);

/**
 * UI schema for the terminally ill question page.
 */
export const uiSchema = {
  'ui:title': 'High Priority claims',
  isTerminallyIll: yesNoUI({
    title: 'Are you terminally ill?',
  }),
  'view:terminallyIllInfo': {
    'ui:description': TerminallyIllInfo,
  },
};

/**
 * Schema for the terminally ill question page.
 */
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
