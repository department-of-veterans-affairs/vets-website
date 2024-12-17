import React from 'react';
import { formatCurrency } from '../utils/helpers';

function LcTestInfo({ tests }) {
  return (
    <va-table table-type="borderless" stacked>
      <va-table-row slot="headers">
        <span>Test</span>
        <span>Fees</span>
      </va-table-row>
      {tests &&
        tests.map((test, index) => {
          return (
            <va-table-row key={index}>
              <span>{test.name}</span>
              <span>{formatCurrency(test.fee)}</span>
            </va-table-row>
          );
        })}
    </va-table>
  );
}

export default LcTestInfo;
