import React from 'react';

export const waiveRetirementPayDescription = (
  <div>
    <p>
      If you’re eligible for both retirement pay and VA compensation pay, you
      can choose whether you want to receive VA compensation pay to balance your
      current retirement pay or get your full retirement pay at the current tax
      rate.
    </p>
    <p>
      VA compensation pay isn’t taxable. Military retirement pay is taxable. VA
      compensation pay is always the greater benefit.
    </p>
    <p>
      Below is an example showing that{' '}
      <strong>
        dollar for dollar VA compensation pay is always the greater benefit.
      </strong>{' '}
      Tax rates will vary depending on income.
    </p>
    <table>
      <thead>
        <tr>
          <th />
          <th>Monthly benefit</th>
          <th>Take-home pay</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Retirement</td>
          <td>$700 (minus taxes)</td>
          <td>$630</td>
        </tr>
        <tr>
          <td>
            <strong>Compensation</strong>
          </td>
          <td>
            <strong>$700 (tax-free)</strong>
          </td>
          <td>
            <strong>$700</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
