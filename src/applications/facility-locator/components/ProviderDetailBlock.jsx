import React from 'react';
import ProviderServiceDescription from './ProviderServiceDescription';

const ProviderDetailBlock = ({ provider }) => {
  const {
    uniqueId,
    gender,
    accNewPatients,
    network,
    prefContact,
  } = provider.attributes;

  return (
    <div className="vads-u-margin-bottom--4">
      <h2 className="highlight">Provider Details</h2>
      <ul>
        <li>
          <strong>Gender:</strong> {gender}
        </li>
        <li>
          <strong>Services:</strong>
          <ProviderServiceDescription provider={provider} details />
        </li>
      </ul>

      <h3 className="highlight vads-u-font-size--h4">Appointments</h3>
      <h3 className="vads-u-font-size--h4">Accepting new patients</h3>
      {accNewPatients ? 'Yes' : 'No'}

      <h3 className="highlight vads-u-font-size--h4">Community Care Details</h3>
      <ul>
        <li>
          <strong>Network:</strong> {network}
        </li>
        <li>
          <strong>Preferred communication method:</strong> {prefContact}
        </li>
        <li>
          <strong>Provider (NPI/Tax) ID:</strong> {uniqueId}
        </li>
      </ul>
    </div>
  );
};

export default ProviderDetailBlock;
