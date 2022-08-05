import React from 'react';

export const uiSchema = {
  selectedDebts: {
    items: {
      'ui:title': 'DEBT X of Y: [DEBT NAME HERE]',
      resolutionOption: {
        'ui:title': (
          <p>
            Which repayment or relief option would you like for your{' '}
            <strong>[DOLLAR] for [PLACE]</strong> debt for Post-9/11 GI Bill
            tuition and fees?
          </p>
        ),
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            waiver: (
              <span>
                <p>
                  <strong>Debt forgiveness (waiver)</strong>
                  If we accept your request, we will stop collection on and
                  forgive (or “waive”) the debt.
                </p>
              </span>
            ),
            payments: (
              <span>
                <p>
                  <strong>Extended monthly payments</strong>
                  If we accept your request, you can make smaller monthly
                  payments for up to 5 years with either monthly offsets or a
                  monthly payment plan.
                </p>
              </span>
            ),
            compromise: (
              <span>
                <p>
                  <strong>Compromise</strong>
                  If you’re unable to either pay the debt in full or make
                  smaller monthly payments, we can consider a smaller, one-time
                  payment to resolve your debt.
                </p>
              </span>
            ),
          },
        },
        'ui:errorMessages': {
          required: 'You must select one of the following.',
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
