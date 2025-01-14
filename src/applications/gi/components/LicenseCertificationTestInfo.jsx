import React from 'react';
import { formatCurrency } from '../utils/helpers';

function LcTestInfo({ tests }) {
  return (
    <>
      <h3>Test info</h3>
      <div className="table-wrapper">
        <va-table table-type="borderless" stacked>
          <va-table-row slot="headers">
            <span>Test Name</span>
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
      </div>
    </>
  );
}

export default LcTestInfo;
