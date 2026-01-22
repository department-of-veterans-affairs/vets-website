import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {object} ExpenseFieldProps
 * @property {object} formData - The form data for the expense
 *
 * @param {ExpenseFieldProps} formData - The form data for the expense
 * @param {object} formData.amount - The amount of the expense
 * @param {string} formData.purpose - The purpose of the expense
 * @returns {React.Element} - The rendered expense field
 */
export default function ExpenseField({ formData }) {
  const noData = !formData.amount && !formData.purpose;

  return noData ? (
    <div>
      <strong>Expense</strong>
    </div>
  ) : (
    <div>
      <strong>{formData.purpose}</strong>
      <br />${formData.amount}
    </div>
  );
}

ExpenseField.propTypes = {
  formData: PropTypes.shape({
    amount: PropTypes.string,
    purpose: PropTypes.string,
  }),
};
