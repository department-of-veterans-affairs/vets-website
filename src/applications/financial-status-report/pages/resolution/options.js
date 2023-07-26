import React from 'react';
import FinancialOverview from '../../components/monetary/FinancialOverview';
import ResolutionDebtCards from '../../components/resolution/ResolutionDebtCards';
import { validateCurrency } from '../../utils/validations';

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
          If we approve your request, we’ll stop collection on and waive the
          debt.
        </li>
        <li>
          <strong>Extended monthly payments: </strong>
          If we approve your request, you can make smaller monthly payments for
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
      classNames: 'resolution-options-available',
      hideOnReview: true,
    },
  },
  selectedDebts: {
    'ui:field': ResolutionDebtCards,
    'ui:options': {
      customTitle: ' ',
      keepInPageOnReview: true,
    },
    items: {
      resolution: {
        agreeToWaiver: {
          'ui:required': (formData, index) => {
            if (formData['view:enhancedFinancialStatusReport']) return false;
            const { resolution, deductionCode } = formData.selectedDebts[index];
            const isCompAndPenDebt = deductionCode === '30';
            return (
              !isCompAndPenDebt &&
              resolution?.resolutionType === 'Waiver' &&
              !resolution?.agreeToWaiver
            );
          },
          'ui:errorMessages': {
            required: 'You must agree by checking the box.',
          },
        },
        offerToPay: {
          'ui:required': (formData, index) => {
            const { resolution } = formData.selectedDebts[index];
            return (
              resolution?.resolutionType !== 'Waiver' && !resolution?.offerToPay
            );
          },
          'ui:errorMessages': {
            required: 'Please enter the amount you can afford to pay.',
          },
          'ui:validations': [validateCurrency],
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
        required: ['resolution'],
        properties: {
          resolution: {
            type: 'object',
            properties: {
              resolutionType: {
                type: 'string',
              },
              agreeToWaiver: {
                type: 'boolean',
              },
              offerToPay: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
