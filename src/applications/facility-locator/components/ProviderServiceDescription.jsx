import React from 'react';

/**
 * Description block for a CC Provider
 *
 * @param {{provider: object, details?: boolean}} props
 *   `provider` is the specific CCProvider search result object.
 *
 *   `details` is a flag as to whether or not this component is being
 *      used on the `/facilities/provider/{id}` details page as the
 *      PPMS provided description of each specialty/service is included
 *      on the details output.
 */
const ProviderServiceDescription = ({ provider, details = false }) => {
  if (details) {
    const { specialty } = provider.attributes;
    if (specialty && specialty.length < 1) return null;

    return (
      <ul>
        {specialty.map(s => (
          <li key={s.name}>
            <u>{s.name}</u>: {s.desc}
          </li>
        ))}
      </ul>
    );
  }

  const services = provider.attributes.specialty.map(s => s.name.trim());
  if (services.length < 1) return null;

  return (
    <p>
      <span>
        <strong>Services:</strong> {services.join(', ')}
      </span>
    </p>
  );
};

export default ProviderServiceDescription;
