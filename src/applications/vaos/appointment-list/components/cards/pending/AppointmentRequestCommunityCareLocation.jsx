import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const providers = appointment.preferredCommunityCareProviders;

  return (
    <>
      <h4 className="vaos-appts__block-label">Preferred provider</h4>
      <div>
        {!providers.length && 'Not specified'}
        {!!providers.length && (
          <ul className="usa-unstyled-list">
            {providers.map(provider => {
              const { practiceName, providerName } = provider;

              return (
                <li key={provider.id}>
                  {!!practiceName && (
                    <>
                      {practiceName}
                      {!!providerName && <br />}
                    </>
                  )}
                  {providerName}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
