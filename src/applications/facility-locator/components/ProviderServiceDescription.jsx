import React from 'react';

const ProviderServiceDescription = ({ provider }) => {
  const services = provider.attributes.specialty.map(s => s.name);

  if (services.length < 1) return null;

  return (
    <p>
      <span><strong>Services:</strong> {services.join(', ')}</span>
    </p>
  );
};

export default ProviderServiceDescription;
