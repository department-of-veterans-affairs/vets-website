import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/helpers';

export default function VeteranProgramsAndSupport({ constants, institution }) {
  const historicalInformation = (
    <div className="usa-width-one-half medium-6 columns">
      <div className="historical-information table">
        <h3>Historical Information</h3>
        <table>
          <thead>
            <tr>
              <th>Benefit</th>
              <th>Recipients</th>
              <th>Total paid (FY {constants.FISCALYEAR})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Post-9/11 GI Bill</th>
              <td>{formatNumber(institution.p911Recipients)}</td>
              <td>{formatCurrency(institution.p911TuitionFees)}</td>
            </tr>
            <tr>
              <th>Yellow Ribbon</th>
              <td>{formatNumber(institution.p911YrRecipients)}</td>
              <td>{formatCurrency(institution.p911YellowRibbon)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return <div className="row">{historicalInformation}</div>;
}
