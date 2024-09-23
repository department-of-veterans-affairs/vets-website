import React from 'react';
import PropTypes from 'prop-types';

import {
  createUSAStateLabels,
  formatReviewDate,
} from 'platform/forms-system/src/js/helpers';
import monthYearRangeUI from 'platform/forms-system/src/js/definitions/monthYearRange';
import { states } from 'platform/forms/address';

// import { loanHistory } from '../../schemaImports';
import LoanReviewField from '../../../components/LoanReviewField';
import text from '../../../content/loanHistory';
import {
  validateVALoanNumber,
  validateUniqueVALoanNumber,
} from '../../../validations';
import { LOAN_INTENT_SCHEMA } from '../../../constants';
import { getLoanIntent } from '../../helpers';

const stateLabels = createUSAStateLabels(states);

const PreviousLoanView = ({ formData }) => {
  const intent = getLoanIntent(formData.intent);
  const {
    propertyAddress1,
    propertyCity,
    propertyState,
    propertyZip,
  } = formData.propertyAddress;
  let from = '';
  let to = '';
  if (formData.dateRange) {
    // formatReviewDate('YYYMMDD', monthYearFlag)
    from = formatReviewDate(formData.dateRange.from, true);
    to = formatReviewDate(formData.dateRange.to, true);
  }

  return (
    <>
      <div>
        <div>{intent ? intent.shortLabel : null}</div>
        <strong>
          {`${propertyAddress1}, ${propertyCity}, ${propertyState}, ${propertyZip}`}
        </strong>
      </div>
      <div>{to ? `${from} - ${to}` : `${from} - present`}</div>
    </>
  );
};

PreviousLoanView.propTypes = {
  formData: PropTypes.shape({
    intent: PropTypes.string,
    dateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    propertyAddress: PropTypes.shape({
      propertyAddress1: PropTypes.string,
      propertyCity: PropTypes.string,
      propertyState: PropTypes.string,
      propertyZip: PropTypes.string,
    }),
  }),
};

export const schema = {
  type: 'object',
  properties: {
    relevantPriorLoans: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          dateRange: {
            $ref: '#/definitions/dateRange',
          },
          propertyAddress: {
            $ref: '#/definitions/loanAddress',
          },
          vaLoanNumber: {
            $ref: '#/definitions/loanNumber',
          },
          propertyOwned: {
            type: 'boolean',
          },
          intent: LOAN_INTENT_SCHEMA,
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:objectViewField': LoanReviewField,
  relevantPriorLoans: {
    'ui:description': 'Tell us about all your VA-backed loans',
    'ui:options': {
      itemName: 'VA-backed Loan',
      viewField: PreviousLoanView,
      keepInPageOnReview: true,
      customTitle: ' ', // Force outer DIV wrap (vs DL wrap, for a11y)
    },
    'ui:validations': [validateUniqueVALoanNumber],
    items: {
      'ui:title': 'Existing VA loan',
      'ui:options': {
        classNames: 'column',
        itemName: 'VA-backed loan',
      },
      dateRange: monthYearRangeUI(
        text.loanClose.title,
        text.loanPaid.title,
        text.loanPaid.error,
        true, // allow start & end to be the same month/year
      ),
      propertyAddress: {
        'ui:title': 'Property address',
        'ui:order': [
          'propertyAddress1',
          'propertyAddress2',
          'propertyCity',
          'propertyState',
          'propertyZip',
        ],
        propertyAddress1: {
          'ui:title': text.address1.title,
          'ui:errorMessages': { required: text.address1.error },
        },
        propertyAddress2: {
          'ui:title': text.address2.title,
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        propertyCity: {
          'ui:title': text.city.title,
          'ui:errorMessages': { required: text.city.error },
        },
        propertyState: {
          'ui:title': text.state.title,
          'ui:options': {
            labels: stateLabels,
          },
          'ui:errorMessages': { required: text.state.error },
        },
        propertyZip: {
          'ui:title': text.postal.title,
          'ui:options': { widgetClassNames: 'usa-input-medium' },
          'ui:errorMessages': {
            required: text.postal.error,
            pattern: text.postal.pattern,
          },
        },
      },
      vaLoanNumber: {
        'ui:title': text.loanNumber.title,
        'ui:description': (
          <div id="va-loan-number">{text.loanNumber.description}</div>
        ),
        'ui:options': {
          widgetClassNames: 'coe-loan-input',
          ariaDescribedby: 'va-loan-number',
        },
        'ui:errorMessages': {
          pattern: text.loanNumber.pattern,
        },
        'ui:validations': [validateVALoanNumber],
      },
      propertyOwned: {
        'ui:title': text.owned.title,
        'ui:widget': 'yesNo',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
        'ui:required': () => true,
      },
      intent: {
        'ui:widget': 'radio',
        'ui:title':
          'How will you use your Certificate of Eligibility with this VA Home Loan:',
        'ui:required': (formData, index) =>
          formData.relevantPriorLoans[index].propertyOwned,
        'ui:options': {
          expandUnder: 'propertyOwned',
        },
      },
    },
  },
};
