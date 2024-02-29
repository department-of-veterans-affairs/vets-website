import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../helpers';

export default function IncomeSourceView({ formData }) {
  return (
    <section>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">
        {formData.typeOfIncome}
      </h3>
      <p className="vads-u-margin-bottom--0">Who receives this income?</p>
      <p className="vads-u-margin-top--0">{formData.receiver}</p>
      <p className="vads-u-margin--0">Who pays this income?</p>
      <p className="vads-u-margin-top--0">{formData.payer}</p>
      <p className="vads-u-margin--0">What's the monthly amount of income?</p>
      <p className="vads-u-margin-top--0">{formatCurrency(formData.amount)}</p>
    </section>
  );
}

IncomeSourceView.propTypes = {
  formData: PropTypes.object,
};
