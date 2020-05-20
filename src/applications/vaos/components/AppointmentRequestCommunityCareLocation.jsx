import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const hasProviders = !!appointment.preferredProviders?.length;

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">Preferred provider</dt>
      <dd>
        {!hasProviders && 'Not specified'}
        {hasProviders && (
          <ul className="usa-unstyled-list">
            {appointment.preferredProviders.map(provider => (
              <li key={`${provider.firstName} ${provider.lastName}`}>
                {provider.practiceName}
                <br />
                {provider.firstName} {provider.lastName}
              </li>
            ))}
          </ul>
        )}
      </dd>
    </dl>
  );
}
