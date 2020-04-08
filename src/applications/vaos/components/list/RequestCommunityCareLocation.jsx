import React from 'react';

export default function RequestCommunityCareLocation({ appointment }) {
  if (!appointment.preferredProviders?.length) {
    return 'Not specified';
  }

  return (
    <ul className="usa-unstyled-list">
      {appointment.preferredProviders.map(provider => (
        <li key={`${provider.firstName} ${provider.lastName}`}>
          {provider.practiceName}
          <br />
          {provider.firstName} {provider.lastName}
        </li>
      ))}
    </ul>
  );
}
