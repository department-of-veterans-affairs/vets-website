import React from 'react';
import { facilityTypes } from '../config';

const ProviderServiceDescription = ({ provider }) => {
  const services = provider.attributes.specialty.map(s => s.name.trim());
  return (
    <div>
      <p>{facilityTypes.cc_provider.toUpperCase()}</p>
      {services.length >= 1 && (
        <p>
          <span>
            <strong>Services:</strong> {services.join(', ')}
          </span>
        </p>
      )}
    </div>
  );
};

export default ProviderServiceDescription;
