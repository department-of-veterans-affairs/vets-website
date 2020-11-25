import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const providers = appointment.contained.filter(
    res => res.resourceType === 'Practitioner',
  );

  return (
    <>
      <h4 className="vaos-appts__block-label">Preferred provider</h4>
      <div>
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
      </div>
    </>
  );
}
