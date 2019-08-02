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
    <div className="mb2">
      <h2 className="highlight">Provider Details</h2>
      <ul>
        <li>
          <strong>Gender:</strong> {gender}
        </li>
        <li>
          <strong>Services:</strong>
        </li>
        <ProviderServiceDescription provider={provider} details />
      </ul>

      <h4 className="highlight">Appointments</h4>
      <h4>Accepting new patients</h4>
      {accNewPatients ? 'Yes' : 'No'}

      <h4 className="highlight">Community Care Details</h4>
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
