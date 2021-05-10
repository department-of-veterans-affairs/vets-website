import React from 'react';
import AvailableDebts from '../../components/AvailableDebts';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const uiSchema = {
  'ui:title': 'What debt do you need help with?',
  availableDebts: {
    'ui:title':
      'Select one or more debts below. We’ll help you choose a debt repayment or relief option for each.',
    'ui:widget': AvailableDebts,
    'ui:required': ({ selectedDebts }) => !selectedDebts.length,
    'ui:options': {
      hideOnReview: true,
    },
    'ui:errorMessages': {
      required: 'Please select at least one debt',
    },
  },
  'view:components': {
    'view:debtNotListed': {
      'ui:description': (
        <>
          <h4>What if my debt isn’t listed here?</h4>
          <p className="vads-u-margin-top--2">
            If you received a letter about a VA benefit debt that isn’t listed
            here, call us at <Telephone contact="8008270648" /> (or{' '}
            <Telephone contact="16127136415" /> from overseas). We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
          <p className="vads-u-margin-top--2">
            If you need help with a VA copay debt,{' '}
            <a href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/">
              learn how to request financial hardship assistance.
            </a>
          </p>
        </>
      ),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    availableDebts: {
      type: 'boolean',
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:debtNotListed': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
