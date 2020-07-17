import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const hasProviders = !!appointment.contained?.length;

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">Preferred provider</dt>
      <dd>
        {!hasProviders && 'Not specified'}
        {hasProviders && (
          <ul className="usa-unstyled-list">
            {appointment.contained.map(provider => (
              <li
                key={`${provider.actor.firstName} ${provider.actor.lastName}`}
              >
                {provider.actor.name}
                <br />
                {provider.actor.firstName} {provider.actor.lastName}
              </li>
            ))}
          </ul>
        )}
      </dd>
    </dl>
  );
}
