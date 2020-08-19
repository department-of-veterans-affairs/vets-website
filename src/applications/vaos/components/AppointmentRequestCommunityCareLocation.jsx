import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const providers = appointment.contained.filter(
    res => res.resourceType === 'Practitioner',
  );

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">Preferred provider</dt>
      <dd>
        {!providers.length && 'Not specified'}
        {!!providers.length && (
          <ul className="usa-unstyled-list">
            {providers.map(provider => (
              <li key={provider.id}>
                {provider.practitionerRole?.[0].location?.[0].display}
                <br />
                {provider.name.text}
              </li>
            ))}
          </ul>
        )}
      </dd>
    </dl>
  );
}
