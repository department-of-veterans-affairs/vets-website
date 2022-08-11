import React from 'react';
import { deductionCodes } from '../../../debt-letters/const/deduction-codes';
import { currency } from '../../utils/helpers';

export const uiSchema = {
  selectedDebts: {
    items: {
      'ui:title': formData => {
        const { deductionCode, benefitType } = formData.formData;
        const index = formData.formContext.pagePerItemIndex;
        return (
          <h3>
            Debt {index} of X: {deductionCodes[deductionCode] || benefitType}
          </h3>
        );
      },
      'ui:description': formData => {
        const { deductionCode, benefitType, currentAr } = formData.formData;
        return (
          <p>
            Which repayment or relief option would you like for your{' '}
            <strong>
              {currency(currentAr)} for{' '}
              {deductionCodes[deductionCode] || benefitType}
            </strong>
            ?
          </p>
        );
      },
      'ui:required': formData => formData.resolutionOption,
      'ui:errorMessages': {
        required: 'Please select an option',
      },
      resolutionOption: {
        'ui:title': ' ',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            waiver: (
              <span>
                <p className="vads-u-margin-bottom--0">
                  <strong>Debt forgiveness (waiver)</strong>
                </p>
                <p className="vads-u-margin-top--0">
                  If we accept your request, we will stop collection on and
                  forgive (or “waive”) the debt.
                </p>
              </span>
            ),
            payments: (
              <span>
                <p className="vads-u-margin-bottom--0">
                  <strong>Extended monthly payments</strong>
                </p>
                <p className="vads-u-margin-top--0">
                  If we accept your request, you can make smaller monthly
                  payments for up to 5 years with either monthly offsets or a
                  monthly payment plan.
                </p>
              </span>
            ),
            compromise: (
              <span>
                <p className="vads-u-margin-bottom--0">
                  <strong>Compromise</strong>
                </p>
                <p className="vads-u-margin-top--0">
                  If you’re unable to either pay the debt in full or make
                  smaller monthly payments, we can consider a smaller, one-time
                  payment to resolve your debt.
                </p>
              </span>
            ),
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['resolutionOption'],
        properties: {
          resolutionOption: {
            type: 'string',
            enum: ['waiver', 'payments', 'compromise'],
          },
        },
      },
    },
  },
};
