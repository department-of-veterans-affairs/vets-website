import React from 'react';
import { CurrentDebtTitle } from '../../components/CurrentDebtTitle';
import ResolutionAmount from '../../components/ResolutionAmount';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': (
        <p className="vads-u-margin-y--0">
          <p className="vads-u-display--block">
            You selected:{' '}
            <span className="vads-u-font-weight--bold">Compromise</span>
          </p>

          <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
            If you can’t pay the debt in full or make smaller monthly payments,
            we can consider a smaller, one-time payment to resolve your debt.
          </span>
        </p>
      ),
      resolutionCompromiseCheck: {
        'ui:title': 'How much can you afford to pay as a one-time payment?',
        'ui:reviewField': null,
        'ui:widget': ResolutionAmount,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        required: ['resolutionCompromiseCheck'],
        properties: {
          resolutionCompromiseCheck: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
