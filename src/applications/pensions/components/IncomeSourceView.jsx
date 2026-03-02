import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../helpers';
import { recipientTypeLabels, typeOfIncomeLabels } from '../labels';

/**
 * @typedef {object} ExpenseFieldProps
 * @property {object} formData - The form data for the expense
 *
 * @param {ExpenseFieldProps} formData - The form data for the expense
 * @param {string} formData.typeOfIncome - The type of income
 * @param {string} formData.receiver - The recipient of the income
 * @param {string} formData.amount - The amount of the income
 * @returns {React.Element} - The rendered expense field
 */
export default function IncomeSourceView({ formData }) {
  return (
    <section>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">
        {typeOfIncomeLabels[formData.typeOfIncome]}
      </h3>
      <p className="vads-u-margin-bottom--0">Who receives this income?</p>
      <p className="vads-u-margin-top--0">
        {recipientTypeLabels[formData.receiver]}
      </p>
      <p className="vads-u-margin--0">Who pays this income?</p>
      <p className="vads-u-margin-top--0">{formData.payer}</p>
      <p className="vads-u-margin--0">What's the monthly amount of income?</p>
      <p className="vads-u-margin-top--0">{formatCurrency(formData.amount)}</p>
    </section>
  );
}

IncomeSourceView.propTypes = {
  formData: PropTypes.shape({
    typeOfIncome: PropTypes.string,
    receiver: PropTypes.string,
    payer: PropTypes.string,
    amount: PropTypes.string,
  }),
};
