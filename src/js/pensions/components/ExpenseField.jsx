import React from 'react';
import moment from 'moment';

export default function ExpenseField({ formData }) {
  const noData = !formData.amount && !formData.date;

  return noData
      ? <div><strong>Expense</strong></div>
      : <div><strong>${formData.amount}</strong><br/>{formData.date && moment(formData.date).format('MMM D, YYYY')}</div>;
}
