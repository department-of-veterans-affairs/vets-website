import React from 'react';
import { LAST_YEAR } from '../../utils/constants';

const DependentExpensesDescription = (
  <span className="vads-u-display--block vads-u-color--gray-medium">
    Only enter an amount if they had gross income to report to the IRS in{' '}
    {LAST_YEAR}. This income is the minimum amount of gross income the IRS
    requires to file a federal income tax return.
  </span>
);

export default DependentExpensesDescription;
