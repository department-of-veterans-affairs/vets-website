import React from 'react';
import { facilityTypes, ccUrgentCareLabels } from '../config';

export const urgentCareProviderNames = posCodes => {
  if (posCodes && parseInt(posCodes, 10) === 17) {
    return ccUrgentCareLabels.WalkIn;
  } else if (posCodes && parseInt(posCodes, 10) === 20) {
    return ccUrgentCareLabels.UrgentCare;
  } else {
    return facilityTypes.urgent_care.toUpperCase();
  }
};

const providerName = (query, posCodes) => {
  let name;
  switch (query.facilityType) {
    case 'cc_pharmacy':
      name = facilityTypes.cc_pharmacy.toUpperCase();
      break;
    case 'urgent_care':
      name = urgentCareProviderNames(posCodes);
      break;
    default:
      name = urgentCareProviderNames(posCodes);
  }
  return name;
};

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
const ProviderServiceDescription = ({ provider, query, details = false }) => {
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

  const services = provider.attributes.specialty.map(s => s.name.trim());
  const { posCodes } = provider.attributes;

  return (
    <div>
      <p>{providerName(query, posCodes)}</p>
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
