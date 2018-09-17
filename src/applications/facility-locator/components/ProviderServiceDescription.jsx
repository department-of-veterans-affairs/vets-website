/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React from 'react';

const ProviderServiceDescription = ({ provider, details = false }) => {
  if (details) {
    const { specialty } = provider.attributes;
    if (specialty.length < 1) return null;

    return (
      <ul style={{ listStyle: 'none' }}>
        { specialty.map(s => (
            <li key={s.name}>
              <u>{s.name}</u>: {s.desc}
            </li>
          )
        )}
      </ul>
    );
  }

  const services = provider.attributes.specialty.map(s => s.name);
  if (services.length < 1) return null;

  return (
    <p>
      <span><strong>Services:</strong> {services.join(', ')}</span>
    </p>
  );
};

export default ProviderServiceDescription;
