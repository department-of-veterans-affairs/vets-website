import React from 'react';
import get from 'platform/utilities/data/get';

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
      <ul className="vads-u-margin-top--1">
        {specialty.map(s => (
          <li key={s.name}>
            <u>{s.name}</u>: {s.desc}
          </li>
        ))}
      </ul>
    );
  }

  const specialties = get(
    ['attributes', 'relationships', 'specialties'],
    provider,
    [],
  ).map(s => s.name.trim());

  if (specialties.length === 0) return null;

  return (
    <div>
      {specialties.length >= 1 && (
        <p>
          <span>
            <strong>Services:</strong> {specialties.join(', ')}
          </span>
        </p>
      )}
    </div>
  );
};

export default ProviderServiceDescription;
