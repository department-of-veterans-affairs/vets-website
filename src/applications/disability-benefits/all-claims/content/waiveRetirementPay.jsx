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
      VA compensation pay isn’t taxable. Military retirement pay is taxable.
      Dollar for dollar VA compensation pay is always the greater benefit.
    </p>
    <table>
      <thead>
        <tr>
          <th>Compensation</th>
          <th>Retirement</th>
          <th>Take home pay</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <del>$700/month</del>
          </td>
          <td>$700/month (minus taxes)</td>
          <td>$630/month</td>
        </tr>
        <tr>
          <td>
            <strong>$700/month (tax-free)</strong>
          </td>
          <td>
            <strong>
              <del>$700/month</del>
            </strong>
          </td>
          <td>
            <strong>$700/month</strong>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      <em>
        This is an example showing that dollar for dollar VA compensation pay
        gives you more spending power than retirement pay. Tax rates will vary
        depending on income.
      </em>
    </p>
  </div>
);
