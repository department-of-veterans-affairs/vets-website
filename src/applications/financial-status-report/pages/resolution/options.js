import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
import ResolutionDebtCards from '../../components/ResolutionDebtCards';

export const uiSchema = {
  financialOverview: {
    'ui:field': FinancialOverview,
    'ui:options': {
      hideOnReview: true,
    },
  },
  availableOptions: {
    'ui:title': 'Resolution options available:',
    'ui:description': () => (
      <ul>
        <li>
          <strong>Waiver: </strong>
          If we accept your request, we will stop collection on and forgive (or
          “waive”) the debt.
        </li>
        <li>
          <strong>Extended monthly payments: </strong>
          If we accept your request, you can make smaller monthly payments for
          up to 5 years with either monthly offsets or monthly payment plan.
        </li>
        <li>
          <strong>Compromise: </strong>
          If you’re unable to either pay the debt in full or make smaller
          monthly payments, we can consider a smaller one-time payment to
          resolve your debt.
        </li>
      </ul>
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
  resolution: {
    'ui:field': ResolutionDebtCards,
  },
};

export const schema = {
  type: 'object',
  properties: {
    financialOverview: {
      type: 'object',
      properties: {},
    },
    availableOptions: {
      type: 'object',
      properties: {},
    },
    resolution: {
      type: 'object',
      properties: {},
    },
  },
};
