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
  selectedDebts: {
    'ui:field': ResolutionDebtCards,
    'ui:options': {
      keepInPageOnReview: true,
    },
    items: {
      resolution: {
        resolutionType: {
          'ui:required': (formData, index) => {
            const { selectedDebts } = formData;
            return !selectedDebts[index].resolution?.resolutionType;
          },
        },
        offerToPay: {
          'ui:required': (formData, index) => {
            const { selectedDebts } = formData;
            return (
              selectedDebts[index].resolution?.resolutionType !== 'Waiver' &&
              !selectedDebts[index].resolution?.offerToPay
            );
          },
        },
        agreeToWaiver: {
          'ui:required': (formData, index) => {
            const { selectedDebts } = formData;
            return (
              selectedDebts[index].resolution?.resolutionType === 'Waiver' &&
              !selectedDebts[index].resolution?.agreeToWaiver
            );
          },
        },
      },
    },
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
    selectedDebts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          resolution: {
            type: 'object',
            properties: {
              resolutionType: {
                type: 'string',
              },
              offerToPay: {
                type: 'string',
              },
              agreeToWaiver: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};
